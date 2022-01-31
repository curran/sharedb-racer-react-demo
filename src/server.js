import express from 'express';

const app = express();
const port = 8080;

app.get('/', async (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
