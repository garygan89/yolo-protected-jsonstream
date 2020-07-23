# yolo-encrypt-stream

A simple demo on how to encrypt JSON stream from Alexey's darknet demo using symmetrical key. Only client with the shared secret key can view the detected object (just the box) for privacy purpose.

## Flow

YOLO Darknet Host (JSON stream) -> Host (encrypt JSON stream using symmetric shared key) -> client (decrypt)

## Required Modules
Install the required modules by

```
npm install
```

## Run
1. Run the HTTP server to serve the website. It uses port `8765` by default

```
node httpserver
```

2. In `wsserver.js`, change `DARKNET_YOLO_URL` to the host running `darknet demo` with `-json` flag.

```
var DARKNET_YOLO_URL = 'http://192.168.1.15:8070';
```

3. Run the websocket server listening on port `3030`.

```
node wsserver.js
```

4. Open your browser and enter `http://localhost:8765` to see a page. By default you won't see anything without decrypting the content.

![](https://i.imgur.com/UN9LQcj.png)


5. Use the `secret.txt` key to decrypt and see the detected object bounding box.

![](https://i.imgur.com/Uap2BZb.png)