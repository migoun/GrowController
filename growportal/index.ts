import express from 'express';
import { getChart } from "./chart";

// index.ts
const app = express();
const port = 3000;
import bodyParser from 'body-parser';

var leafOffset: number = 2;
var startDate: string = "";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // if the site is called like http://pi:3000?offset=7, the chart and everything will calculate that here
  if (req.query.offset) {
    leafOffset = +req.query.offset;
  }

  if (req.query.startDate) 
    startDate = req.query.startDate.toString();  

  getChart(leafOffset, startDate)
    .then((data) => res.send(data));  
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

