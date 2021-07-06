import {Request, Response} from "express";
const Router = require('express');
const router = Router();

const sumNum = (num1: number, num2: number): number => num1 + num2;

router.get('/', (req: Request, res: Response) => {
    console.log(sumNum(5, 12));
    res.send('Hello');
})

module.exports = router;