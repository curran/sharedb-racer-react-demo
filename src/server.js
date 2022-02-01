import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';

const app = express();
const port = 8080;

app.get('/', async (req, res) => {
  res.send(renderToString(<div>Hello</div>));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
