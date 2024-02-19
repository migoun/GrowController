import * as math from 'mathjs';
import * as fs from 'fs';

export function vpd(temperature: number, humidity: number, leafTemperatureOffset: number = 2): number {
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

export function vpdChart(leafOffset: number)
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
            const v: number = vpd(t,h,leafOffset);
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

    return fs.readFileSync('vpd.html','utf8')
        .replace('_CONTENT_', content)
        .replace('_LEAFOFFSET_', leafOffset.toString());
}