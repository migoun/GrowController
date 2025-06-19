// https://plotly.com/javascript/time-series/#time-series-with-rangeslider
import { getData } from "./db";
import { vpd, vpdChart } from "./vpd";
import { Measure } from "./measure";
import * as fs from 'fs';

function hoursAgo(currentDate: string, hours: number): string
{
  const d = new Date(currentDate);
  return new Date(d.setHours(d.getHours() - hours)).toISOString();
}

const htmlContent = (dates: string, temp: string, hum: string, vpd: string, firstDate: string, lastDate: string, leafOffset: number) => 
{
  let file = fs.readFileSync('chart.html','utf8');
  return file
          .replaceAll("_VPDCHART_", vpdChart(leafOffset))
          .replaceAll("_DATES_", dates)
          .replaceAll("_TEMPERATURE_", temp)
          .replaceAll("_HUMIDITY_", hum)
          .replaceAll("_VPD_", vpd)
          .replaceAll("_FIRSTDATE_", firstDate)
          .replaceAll("_LASTDATE_", lastDate);
}

export function getChart(leafOffset: number, firstDate: string = "")
{
  return new Promise<any>((resolve, reject) => { 
    getData(firstDate)
      .then((data) => {
        let startDate: string;
        if (firstDate == "all")
          startDate = data[0].timestamp;
        else if (firstDate == "")
          startDate = hoursAgo(data[data.length - 1].timestamp, 24);
        else startDate = firstDate;

        let endDate = data[data.length - 1].timestamp;

        resolve(htmlContent(
          JSON.stringify(data.map((x: Measure) => x.timestamp)),
          JSON.stringify(data.map((x: Measure) => x.temperature)),
          JSON.stringify(data.map((x: Measure) => x.humidity)),
          JSON.stringify(data.map((x: Measure) => vpd(x.temperature, x.humidity, leafOffset))),
          startDate,
          endDate,
          leafOffset
        ));
      })
      .catch((err) => reject(JSON.stringify(err)));
  });
}