// https://plotly.com/javascript/time-series/#time-series-with-rangeslider
import { getData } from "./db";
import { vpd, vpdChart } from "./vpd";

function daysBefore(currentDate: string, days: number): string
{
  const d = new Date(currentDate);
  return new Date(d.setDate(d.getDate() - days)).toISOString();
}

const htmlContent = (dates: string, temp: string, hum: string, vpd: string, firstDate: string, lastDate: string) => 
{
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js" charset="utf-8"></script>    
    <style>
      .highlight {
        border: 2px solid red; /* Red border */
        font-weight: bold; /* Bold text */
      }
    </style>
  </head>
    <body>    
      <div id="tempchart">
      </div>
      ${vpdChart()}
      <script>
          var data1 = [{
                  type: "scatter",
                  mode: "lines",    
                  name: 'Temperature',    
                  line: {color: '#7F0000'},
                  hovertemplate: '%{y:.2f}°',
                  x: ${dates},
                  y: ${temp}
              },
              {
                  type: "scatter",
                  mode: "lines",    
                  name: 'Humidity',    
                  line: {color: '#00007F'},
                  hovertemplate: '%{y}%',
                  x: ${dates},
                  y: ${hum}
              },
              {
                  type: "scatter",
                  mode: "lines",    
                  name: 'VPD',    
                  line: {color: '#999999'},
                  hovertemplate: '%{y}%',
                  x: ${dates},
                  y: ${vpd}
              }
          ];

          var layout = {
              title: 'Grow Environment',              
              hovermode: 'x unified',
              xaxis: {
                  autorange: true,
                  range: ["${firstDate}", "${lastDate}"],
                  rangeselector: {
                      buttons: [
                          {step: 'all'},
                          {
                            count: 1,
                            label: 'month',
                            step: 'month',
                            stepmode: 'backward'
                          },                       
                          {
                              count: 7,
                              label: 'week',
                              step: 'day',
                              stepmode: 'backward'
                          }
                      ]
                  },
                  rangeslider: {
                      range: ["${daysBefore(lastDate, 2)}", "${lastDate}"]
                  },
                  type: 'date'
              },
              yaxis: {
                  autorange: false,
                  range: [0, 90],
                  type: 'linear'
              },
              height: 800
          };

          // Function to change the background color and add a bold red frame around a cell
          function toggleCellStyle(cellId) {
            var cell = document.getElementById(cellId);
            if (cell.classList.contains('highlight')) {
              // If the cell has the 'highlight' class, remove it
              cell.classList.remove('highlight');
            } else {
              // If the cell doesn't have the 'highlight' class, add it
              cell.classList.add('highlight');
            }
          }

          GRAPH = document.getElementById('tempchart');
          hoverInfo = document.getElementById('hoverinfo');
          Plotly.newPlot( "tempchart", data1, layout);

          GRAPH.on('plotly_hover', function(data){
              let obj = {};
              data.points.forEach(d => {
                obj[d.data.name] = d.y.toPrecision(3);
              });          
              toggleCellStyle(Math.round(obj["Temperature"]) + "-" + Math.round((obj["Humidity"] / 5)) * 5);         
          })
          
          .on('plotly_unhover', function(data){          
                       
          });
      </script>
    </body>
  </html>
  `
}

interface Measure {
  id: number,
  timestamp: string,
  temperature: number,
  humidity: number
}

export function getChart()
{
  return new Promise<any>((resolve, reject) => { 
    getData()
      .then((data) => {
        resolve(htmlContent(
          JSON.stringify(data.map((x: Measure) => x.timestamp)),
          JSON.stringify(data.map((x: Measure) => x.temperature)),
          JSON.stringify(data.map((x: Measure) => x.humidity)),
          JSON.stringify(data.map((x: Measure) => vpd(x.temperature, x.humidity))),
          data[0].timestamp, data[data.length - 1].timestamp
        ));
      })
      .catch((err) => reject(JSON.stringify(err)));
  });
}