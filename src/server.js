import express from 'express';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import http from 'http';
import React from 'react';
import { renderToString } from 'react-dom/server';

const app = express();
const port = 8080;

const backend = new ShareDB();

app.get('/', async (req, res) => {
  res.send(renderToString(<div>Hello</div>));
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  shareDBBackend.listen(new WebSocketJSONStream(ws));
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
