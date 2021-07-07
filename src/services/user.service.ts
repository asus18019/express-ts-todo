import { Request } from "express";
import User from '../models/user.model'
import Role from "../models/role.model";
import { Document } from "mongoose";
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const bcrypt = require('bcryptjs');

interface IAccessTokenPayload {
    id: string,
    role: string
}

interface IRole extends Document{
    value: string
}

class UserService {
    hashPassword = (password: string): string => bcrypt.hashSync(password, 8);

    async setUserRole(): Promise<string> {
        const role: IRole = await Role.findOne({value: "USER"});
        return role.value;
    }

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