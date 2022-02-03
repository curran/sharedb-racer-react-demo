import express from 'express';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import http from 'http';
import React from 'react';
import { renderToString } from 'react-dom/server';
import pkg from '../package.json';
import { App } from './App';
import { encode } from './pageData';

const app = express();
const port = 8080;

const backend = new ShareDB();

//const cdn = 'https://unpkg.com';
const cdn = 'https://cdn.jsdelivr.net/npm';
const reactVersion = pkg.dependencies.react.replace('^', '');

export const indexHTML = (rootHTML, pageData) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ShareDB React Racer Demo</title>
  </head>
  <body>
    <div id="root">${rootHTML}</div>
    <script src="${cdn}/react@${reactVersion}/umd/react.production.min.js"></script>
    <script src="${cdn}/react-dom@${reactVersion}/umd/react-dom.production.min.js"></script>
    <script>window.pageData = "${encode(pageData)}";</script>
    <script src="client.js"></script>
  </body>
</html>`;

app.get('/', (req, res) => {
  res.send(indexHTML(renderToString(<App />), { foo: 'bar' }));
});

app.use(express.static('build/public'));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  shareDBBackend.listen(new WebSocketJSONStream(ws));
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
