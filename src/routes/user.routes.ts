import {Request, Response} from "express";
import Router from 'express';
const userController = require('../controllers/user.controller');
const router = Router();
import { check } from 'express-validator';


router.post('/registration', [
    check('username', 'username is empty').notEmpty(),
    check('password', 'incorrect password length').isLength({min: 4, max: 20})
] ,userController.registration);

module.exports = router;