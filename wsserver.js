var oboe = require('oboe'); // to receive YOLO local JSON stream
var fernet = require('fernet'); // symmetrical key encryption
var WebSocket = require('ws');

// IP of the host running darknet demo
var DARKNET_YOLO_URL = 'http://192.168.1.15:8070';

function YOLOObject(class_id, name, relative_coordinates, confidence) {
    this.class_id = class_id;
    this.name = name;
    this.relative_coordinates = relative_coordinates;
    this.confidence = confidence;
}

var data = [];
var yoloObjects = new Array();
var jsonStr = "";
var count = 0;

// not a good way to store the secret key, but it is what it is 
var secret = new fernet.Secret("cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4=");
var cryptData;
var decryptData;

var wss = new WebSocket.Server({ port: 3030});
console.log('starting websocket server on port 3030...');
wss.on('connection', (wsc) => {
  console.log('connected');
  console.log('client Set length: ', wss.clients.size);  
   
  wsc.on('close', (wsc) => {
    console.log('closed');
    console.log('Number of clients: ', wss.clients.size);
  });
});

function pushDataToClients(data) {
    if (wss != null) {
        wss.clients.forEach((client) => {
           console.log('sending crypt data to all connected clients...');

          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
    }
}

oboe(DARKNET_YOLO_URL)
    .node('objects.*', function (objectThing) { // iterate per 'frame'
    
    count++;
    
    // console.log(objectThing);
    
    yoloObjects.push(new YOLOObject(objectThing.class_id, objectThing.name, objectThing.relative_coordinates, objectThing.confidence));
    
    // send an update every 30 objects
    if (count % 30 == 0) {
        for (i = 0 ; i < yoloObjects.length; i++) {
            var dict = {};
            dict['class_id'] = yoloObjects[i].class_id;
            dict['confidence'] = yoloObjects[i].confidence;
            dict['relative_coordinates'] = yoloObjects[i].relative_coordinates;
            data[i] = dict;
        }
        
        // console.log(data);
        cryptData = encrypt(data);
        // console.log(cryptData);
        pushDataToClients(cryptData);

        // decryptData = decrypt(cryptData);
        // console.log('Decrypt: ' + decryptData);
        
        // console.log('next');
        
        // clear array
        yoloObjects.splice(0, yoloObjects.length);
        
        count = 0;
    };
    
    });

 
    
function encrypt(data) {    
    //Have to include time and iv to make it deterministic.
    //Normally time would default to (new Date()) and iv to something random.
    var token = new fernet.Token({
      secret: secret,
      time: Date.parse(1),
      iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    });
    
    return token.encode(JSON.stringify(data));    
}

function decrypt(data) {
    var token = new fernet.Token({
      secret: secret,
      token: data,
      ttl: 0
    })
    return token.decode();
}

    
    
    
    