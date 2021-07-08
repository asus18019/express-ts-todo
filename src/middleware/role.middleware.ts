import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (roles: string | string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token: string | undefined = req.headers?.authorization?.split(' ')[1];
            if(!token){
                return res.status(403).json({message: "Unauthenticated"})
            }
            const userRoles: string[] = jwt.verify(token, secret).role;
            let hasRole: boolean = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if(!hasRole){
                return res.status(403).json({message: 'You dont have the right role'});
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Unauthenticated"})
        }
    }
}