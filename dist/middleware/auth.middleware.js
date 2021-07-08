"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
module.exports = function () {
    return function (req, res, next) {
        var _a, _b;
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: "Unauthenticated" });
            }
            jwt.verify(token, secret); // ???
            next();
        }
        catch (e) {
            console.log(e);
            return res.status(403).json({ message: "Unauthenticated" });
        }
    };
};
