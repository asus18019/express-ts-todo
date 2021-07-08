import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function () {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token: string | undefined = req.headers?.authorization?.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: "Unauthenticated"})
            }
            jwt.verify(token, secret); // ???
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Unauthenticated"})
        }
    }
}