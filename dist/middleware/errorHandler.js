"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error(err.stack || err.message);
    res.status(500).json({ error: 'Internal Server Error' });
}
