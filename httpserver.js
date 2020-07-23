const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// serve the browsified fernet so that we could call it in client
app.get('/js', (req, res) => {
  res.sendFile(path.join(__dirname, 'fernetBrowser.js'));
});

const port = 8765;
app.listen(port, () => {
  console.log(`HTTP Web Server listening http://localhost:${port}`);
});