"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vpdChart = exports.vpd = void 0;
const math = __importStar(require("mathjs"));
function vpd(temperature, humidity, leafTemperatureOffset = 2) {
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
exports.vpd = vpd;
function vpdChart(leafOffset) {
    let content = "";
    content += "<tr>\n<th>Temp /<br> Hum</th>";
    for (let h = 90; h > 0; h -= 5) {
        content += "<th>" + h + "%</th>";
    }
    content += "</tr>";
    for (let t = 12; t <= 35; t++) {
        content += "<tr>\n<th>" + t + "°</th>";
        for (let h = 90; h > 0; h -= 5) {
            const v = vpd(t, h, leafOffset);
            let css = "danger";
            if (v >= 0.4 && v < 0.8)
                css = "earlyveg";
            else if (v >= 0.8 && v < 1.2)
                css = "lateveg";
            else if (v >= 1.2 && v < 1.6)
                css = "lateflower";
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
        <p style="font-family: 'Arial', sans-serif;">
        Leaf-Temperature (measured by infrared thermometer)<br>
        <input type="number" id="leafOffsetInput" value=${leafOffset}>
        </p>
        <script>
        var input = document.getElementById('leafOffsetInput');
        input.addEventListener('change', (event) => {
            let offset = event.target.value;
            fetch('/setVariable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ offset })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "OK") {
                    window.location.href = window.location.origin + window.location.pathname + "?offset=" + offset;
                }
            })
        });
        </script>
    `;
}
exports.vpdChart = vpdChart;
