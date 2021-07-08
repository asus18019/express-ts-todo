import {Request} from "express";
import User from '../models/user.model'
import Role from "../models/role.model";
import {Document} from "mongoose";
import {IUser} from "../controllers/user.controller";
import {ICar} from "./car.service";

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

export interface IUserID {
    id: string
}

class UserService {
    hashPassword = (password: string): string => bcrypt.hashSync(password, 8);

    setUserRole = async (): Promise<string> => {
        const role: IRole = await Role.findOne({value: "USER"});
        return role.value;
    }

    checkDuplicateUsername = async (res: Request, username: string): Promise<boolean> => {
        return User.findOne({username});
    }

    generateAccessToken = (id: string, role: string): string => {
        const payload: IAccessTokenPayload = {
            id,
            role
        }
        return jwt.sign(payload, secret, {expiresIn: "24h"});
    }

    getAuthUserIDByToken = (req: Request): IUserID => {
        const token: string | undefined = req.headers?.authorization?.split(' ')[1];
        return jwt.verify(token, secret);
    }

    setCarIDtoUser = async (userID: string, car: ICar): Promise<IUser> => {
        const user: IUser = await User.findById(userID);
        user.cars.push(car._id);
        await user.save();
        return user;
    }
}

module.exports = new UserService()