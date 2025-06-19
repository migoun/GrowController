"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chart_1 = require("./chart");
// index.ts
const app = (0, express_1.default)();
const port = 3000;
const body_parser_1 = __importDefault(require("body-parser"));
var leafOffset = 2;
// Middleware to parse JSON bodies
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    // if the site is called like http://pi:3000?offset=7, the chart and everything will calculate that here
    if (req.query.offset)
        leafOffset = +req.query.offset;
    (0, chart_1.getChart)(leafOffset)
        .then((data) => res.send(data));
});
// Endpoint to set the variable
app.post('/setVariable', (req, res) => {
    leafOffset = req.body.offset;
    res.send({ message: 'OK' });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
