"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const userService = require('../services/user.service');
const bcrypt = require('bcryptjs');
const express_validator_1 = require("express-validator");
class UserController {
    constructor() {
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: errors });
                }
                const userData = req.body;
                if (yield userService.checkDuplicateUsername(res, userData.username)) {
                    return res.status(400).json({ message: 'username already exist' });
                }
                const user = new user_model_1.default({
                    username: userData.username,
                    password: userService.hashPassword(userData.password),
                    roles: [yield userService.setUserRole()],
                    cars: []
                });
                yield user.save();
                return res.json({ message: 'Registered' });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Registration error' });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: errors });
                }
                const userData = req.body;
                const user = yield user_model_1.default.findOne({ username: userData.username });
                if (!user) {
                    res.status(400).json({ message: `User ${userData.username} not found in system` });
                }
                const validPassword = bcrypt.compareSync(userData.password, user.password);
                if (!validPassword) {
                    res.status(400).json({ message: `Invalid credentials` });
                }
                const token = userService.generateAccessToken(user._id, user.roles);
                return res.json({ token: token });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Login error' });
            }
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.find();
                return res.json(users);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Get user error' });
            }
        });
    }
}
module.exports = new UserController();
