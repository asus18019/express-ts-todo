import {Request} from "express";
import User from '../models/user.model'
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

interface IAccessTokenPayload {
    id: string,
    role: string
}

class UserService {
    async checkDuplicateUsername (res: Request, username: string): Promise<boolean> {
        return User.findOne({username});
    }

    generateAccessToken = (id: string, role: string): string => {
        const payload: IAccessTokenPayload = {
            id,
            role
        }
        return jwt.sign(payload, secret, {expiresIn: "24h"});
    }
}

module.exports = new UserService()