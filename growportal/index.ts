import express from 'express';
import { getChart } from "./chart";
import * as path from 'path';

// index.ts
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  getChart()
    .then((data) => res.send(data));  
});

app.get('/test', (req, res) => {
  res.sendFile('test.html', {
    root: path.join(__dirname)});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


// getData()
//     .then((any) => console.log(JSON.stringify(any)))
//     .catch((err) => console.log(JSON.stringify(err)));