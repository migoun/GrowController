"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
function getData() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3_1.default.Database('growcontrol.db');
        let result = {};
        db.all('SELECT * FROM measurement_history', (err, rows) => {
            if (err) {
                reject({ error: err.message });
            }
            else {
                // return all db entries, but increase hour by 1. Because it seems like UTC in the database
                resolve(rows.map(function (e) {
                    // Create a Date object from the timestamp string
                    let originalTimestamp = new Date(e.timestamp);
                    // Add one hour to the Date object
                    originalTimestamp.setHours(originalTimestamp.getHours() + 2);
                    // Format the new Date object to the desired string format
                    e.timestamp = originalTimestamp.toISOString().slice(0, 19).replace("T", " ");
                    return e;
                }));
            }
        });
        db.close();
    });
}
exports.getData = getData;
