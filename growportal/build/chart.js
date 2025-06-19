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
exports.getChart = void 0;
// https://plotly.com/javascript/time-series/#time-series-with-rangeslider
const db_1 = require("./db");
const vpd_1 = require("./vpd");
const fs = __importStar(require("fs"));
function daysBefore(currentDate, days) {
    const d = new Date(currentDate);
    return new Date(d.setDate(d.getDate() - days)).toISOString();
}
const htmlContent = (dates, temp, hum, vpd, firstDate, lastDate, leafOffset) => {
    let file = fs.readFileSync('chart.html', 'utf8');
    return file
        .replace("_VPDCHART_", (0, vpd_1.vpdChart)(leafOffset))
        .replaceAll("_DATES_", dates)
        .replace("_TEMPERATURE_", temp)
        .replace("_HUMIDITY_", hum)
        .replace("_VPD_", vpd)
        .replace("_FIRSTDATE_", daysBefore(lastDate, 2))
        .replace("_LASTDATE_", lastDate);
};
function getChart(leafOffset) {
    return new Promise((resolve, reject) => {
        (0, db_1.getData)()
            .then((data) => {
            resolve(htmlContent(JSON.stringify(data.map((x) => x.timestamp)), JSON.stringify(data.map((x) => x.temperature)), JSON.stringify(data.map((x) => x.humidity)), JSON.stringify(data.map((x) => (0, vpd_1.vpd)(x.temperature, x.humidity, leafOffset))), data[0].timestamp, data[data.length - 1].timestamp, leafOffset));
        })
            .catch((err) => reject(JSON.stringify(err)));
    });
}
exports.getChart = getChart;
