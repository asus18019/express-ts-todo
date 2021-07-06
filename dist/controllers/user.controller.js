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
const role_model_1 = __importDefault(require("../models/role.model"));
const userService = require('../services/user.service');
const bcrypt = require('bcryptjs');
const express_validator_1 = require("express-validator");
const hashPassword = (password) => bcrypt.hashSync(password, 8);
const setUserRole = () => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield role_model_1.default.findOne({ value: "USER" });
    return role.value;
});
class UserController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    password: hashPassword(userData.password),
                    roles: [yield setUserRole()],
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
    }
    ;
}
module.exports = new UserController();
