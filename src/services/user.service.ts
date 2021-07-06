import {Request} from "express";
import User from '../models/user.model'
import mongoose from "mongoose";

class UserService {
    async checkDuplicateUsername (res: Request, username: string): Promise<boolean> {
        return User.findOne({username});
    }
}

module.exports = new UserService()