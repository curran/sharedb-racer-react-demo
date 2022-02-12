import express from 'express';
import racer from 'racer';
import WebSocket from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import http from 'http';
import React from 'react';
import { renderToString } from 'react-dom/server';
import pkg from '../package.json';
import { App } from './App';

const app = express();

const port = 8080;

const backend = racer.createBackend();
app.use(backend.modelMiddleware());

//const cdn = 'https://unpkg.com';
const cdn = 'https://cdn.jsdelivr.net/npm';
const reactVersion = pkg.dependencies.react.replace('^', '');

// `encode`
// Responsible for safely transporting page data from the server,
// via a JSON string in HTML JS to the client rendered app.
// Inspired by https://github.com/derbyjs/racer-examples/blob/abe0802d3f997de2d31386fb3422bf4dcb9107b5/pad/server.js#L84
// TODO consider using https://www.npmjs.com/package/jsesc
export const encode = (pageData) =>
  JSON.stringify(pageData).replace(/<\//g, '<\\/').replace(/<!/g, '<\\u0021');

export const indexHTML = ({ rootHTML, pageData }) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ShareDB React Racer Demo</title>
  </head>
  <body>
    <div id="root">${rootHTML}</div>
    <script src="${cdn}/react@${reactVersion}/umd/react.production.min.js"></script>
    <script src="${cdn}/react-dom@${reactVersion}/umd/react-dom.production.min.js"></script>
    <script>window.pageData = ${encode(pageData)};</script>
    <script src="client.js"></script>
  </body>
</html>`;

app.get('/', (req, res) => {
  // Inspired by
  // https://github.com/derbyjs/racer-examples/blob/master/pad/server.js#L62
  const model = req.model;
  const roomId = 'test'; // req.params.roomId
  const $room = model.at('rooms.' + roomId);

  $room.subscribe((err) => {
    if (err) return next(err);
    var room = $room.get();

    // If the room doesn't exist yet, we need to create it
    $room.createNull({ content: '' });

    // Reference the current room's content for ease of use
    model.ref('_page.room', $room.at('content'));

    //var html = renderIndex({
    //  room: $room.get('id'),
    //  text: $room.get('content'),
    //});

    model.bundle((err, bundle) => {
      if (err) return next(err);
      res.send(
        indexHTML({
          rootHTML: renderToString(<App model={model} />),
          pageData: bundle,
        })
      );
    });
  });
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
