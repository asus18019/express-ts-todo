import {Request, Response} from "express";
import User from '../models/user.model';
import Role from '../models/role.model';
const userService = require('../services/user.service');
const bcrypt = require('bcryptjs');
import { validationResult } from 'express-validator';

interface IRegisterData {
    username: string,
    password: string
}

interface IRole {
    value: string
}

const hashPassword = (password: string): string => bcrypt.hashSync(password, 8);

const setUserRole = async (): Promise<string> => {
    const role: IRole = await Role.findOne({value: "USER"});
    return role.value;
}

class UserController {
    async registration(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: errors});
            }

            const userData: IRegisterData = req.body;
            if(await userService.checkDuplicateUsername(res, userData.username)){
                return res.status(400).json({message: 'username already exist'});
            }
            const user = new User({
                username: userData.username,
                password: hashPassword(userData.password),
                roles: [await setUserRole()],
                cars: []
            });
            await user.save();
            return res.json({message: 'Registered'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    };
}

module.exports = new UserController();

