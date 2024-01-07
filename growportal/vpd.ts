import * as math from 'mathjs';

export function vpd(temperature: number, humidity: number, leafTemperatureOffset: number = 1.15): number {
    // Calculate saturation vapor pressure (Tetens formula)
    const svp = 0.61078 * math.exp((17.269 * temperature) / (237.3 + temperature));

    // Calculate actual vapor pressure
    const vp = (humidity / 100) * svp;

    const leafTemperature = temperature - leafTemperatureOffset;

    const svpLeaf = 0.61078 * math.exp((17.269 * leafTemperature) / (237.3 + leafTemperature));
    // Calculate actual vapor pressure for leaf temperature
    const vpLeaf = (humidity / 100) * svpLeaf;
    
    // Calculate Vapor Pressure Deficit (VPD)
    const vpdValue = svpLeaf - vp;

    return vpdValue;
}

export function vpdChart()
{
    let content: string = "";
    content += "<tr>\n<th>Temp /<br> Hum</th>";
    for (let h: number = 90; h>0; h-=5)
    {
        content += "<th>" + h + "%</th>";
    }
    content += "</tr>";

    for (let t: number = 12; t<=35; t++)
    {
        content += "<tr>\n<th>" + t + "°</th>";
        for (let h: number = 90; h>0; h-=5)
        {
            const v: number = vpd(t,h);
            let css: string = "danger";
            if (v >= 0.4 && v < 0.8)
                css = "earlyveg";
            else if (v >= 0.8 && v < 1.2)
                css = "lateveg";
            else if (v >= 1.2 && v < 1.6)
                css = "lateflower"
            
            content += "<td id=" + t + "-" + h + " class=" + css + ">" + v.toFixed(2) + "</td>";
        }
        content += "</tr>\n";
    }

    return `
         <style>
            /* Style for the table */
            table {
                width: 60em;
                border-collapse: collapse;
                border: 1px solid #ddd; /* Slight border for the table */
            }
            
            /* Style for the table header */
            th {
                background-color: #f2f2f2; /* Light gray background for the header */
                border: 1px solid #ddd; /* Slight border for the header cells */
                font-size: 14px; /* Adjust font size for the header */
                font-family: 'Arial', sans-serif;                 
            }
            
            /* Style for the table rows */
            td {
                border: 1px solid #ddd; /* Slight border for the table cells */
                font-size: 14px; /* Adjust font size for the header */
                font-family: 'Arial', sans-serif; 
            }    

            .earlyveg {
                background-color: lightgreen;
            }

            .lateveg {
                background-color: lightblue;
            }

            .lateflower {
                background-color: #d8bfd8;
            }

            .danger {
                background-color: #ffaaaa;
            }
        </style>
        <table style="float: left; width: 900px;margin-right:20px;">
            ${content}
        </table>
        <table style="width: 200px;">
            <tr>
                <td class="earlyveg">Early Veg Stage</td>
            </tr>
            <tr>
                <td class="lateveg">Late Veg / Early Flower Stage</td>
            </tr>
            <tr>
                <td class="lateflower">Mid / Late Flower Stage</td>
            </tr>
            <tr>
                <td class="danger">Danger Zone</td>
            </tr>
        </table>
    `
}