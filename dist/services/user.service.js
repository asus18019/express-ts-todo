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
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const bcrypt = require('bcryptjs');
class UserService {
    constructor() {
        this.hashPassword = (password) => bcrypt.hashSync(password, 8);
        this.setUserRole = () => __awaiter(this, void 0, void 0, function* () {
            const role = yield role_model_1.default.findOne({ value: "USER" });
            return role.value;
        });
        this.checkDuplicateUsername = (res, username) => __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ username });
        });
        this.generateAccessToken = (id, role) => {
            const payload = {
                id,
                role
            };
            return jwt.sign(payload, secret, { expiresIn: "24h" });
        };
        this.getAuthUserIDByToken = (req) => {
            var _a, _b;
            const token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            return jwt.verify(token, secret);
        };
        this.setCarIDtoUser = (userID, car) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(userID);
            user.cars.push(car._id);
            yield user.save();
            return user;
        });
    }
}
module.exports = new UserService();
