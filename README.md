# yolo-encrypt-stream

A simple demo on how to encrypt JSON stream from Alexey's darknet demo using symmetrical key. Only client with the shared secret key can view the detected object (just the box) for privacy purpose.

## Flow

YOLO Darknet Host (JSON stream) -> Host (encrypt JSON stream using symmetric shared key) -> client (decrypt)

## Required Modules
Install the required modules by

```
npm install
```

## Change Settings
In `wsserver.js`, change `DARKNET_YOLO_URL` to the host running `darknet demo` with `-json` flag. Default is localhost

```
var DARKNET_YOLO_URL = 'http://localhost:8070';
```

In `index.html`, change `src="http://<HOSTIP_WHERE_YOU_PUT_THIS_FILE:8765/js">` to the host IP where you run `node`.
```
    <!-- Server location to get the fernetBrowser.js, which is a Browsify script in node_modules/fernet/fernetBrowser.js -->
    <script src="http://<HOSTIP_WHERE_YOU_PUT_THIS_FILE:8765/js"></script> 
    <script>
```

## Run
1. Run the HTTP server to serve the website. It uses port `8765` by default

```
node httpserver
```

2. Run the websocket server listening on port `3030`.

```
node wsserver.js
```

3. Open your browser and enter `http://<HOSTIP_RUNNING_NODE>:8765` to see a page. By default you won't see anything without decrypting the content.

![](https://i.imgur.com/UN9LQcj.png)


4. Use the `secret.txt` key to decrypt and see the detected object bounding box.

![](https://i.imgur.com/Uap2BZb.png)