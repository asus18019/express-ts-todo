"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = require('../controllers/user.controller');
const router = express_1.default();
const express_validator_1 = require("express-validator");
router.post('/registration', [
    express_validator_1.check('username', 'username is empty').notEmpty(),
    express_validator_1.check('password', 'incorrect password length').isLength({ min: 4, max: 20 })
], userController.registration);
router.post('/login', [
    express_validator_1.check('username', 'username is empty').notEmpty(),
    express_validator_1.check('password', 'password is empty').notEmpty()
], userController.login);
module.exports = router;
