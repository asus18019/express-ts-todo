import { Request, Response } from "express";
import User from '../models/user.model';
const userService = require('../services/user.service');
const bcrypt = require('bcryptjs');
import { Document, Schema } from 'mongoose';
import { Result, ValidationError, validationResult } from 'express-validator';

interface ILoginData {
    username: string,
    password: string
}

interface IRegisterData extends ILoginData{}

export interface IUser extends Document {
    username: string,
    password: string,
    roles: string[],
    cars: Schema.Types.ObjectId[]
}

interface IUserController {
    registration(req: Request, res: Response): Promise<Response | undefined>,
    login(req: Request, res: Response): Promise<Response | undefined>,
    getUsers(req: Request, res: Response): Promise<Response | undefined>
}

class UserController implements IUserController{
    registration = async (req: Request, res: Response): Promise<Response | undefined> => {
        try {
            const errors: Result<ValidationError> = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: errors});
            }

            const userData: IRegisterData = req.body;
            if(await userService.checkDuplicateUsername(res, userData.username)){
                return res.status(400).json({message: 'username already exist'});
            }
            const user: IUser = new User({
                username: userData.username,
                password: userService.hashPassword(userData.password),
                roles: [await userService.setUserRole()],
                cars: []
            });
            await user.save();
            return res.json({message: 'Registered'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    };
    
    login = async (req: Request, res: Response): Promise<Response | undefined> => {
        try {
            const errors: Result<ValidationError> = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: errors});
            }

            const userData: ILoginData = req.body;
            const user: IUser = await User.findOne({username: userData.username});
            if (!user) {
                res.status(400).json({message: `User ${userData.username} not found in system`});
            }
            const validPassword: boolean = bcrypt.compareSync(userData.password, user.password);
            if (!validPassword) {
                res.status(400).json({message: `Invalid credentials`});
            }
            const token: string = userService.generateAccessToken(user._id, user.roles);
            return res.json({token: token});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    getUsers = async (req: Request, res: Response): Promise<Response | undefined> => {
        try {
            const users: IUser[] = await User.find();
            return res.json(users);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get user error'});
        }
    };
}

module.exports = new UserController();

