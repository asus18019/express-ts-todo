"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require('express');
const router = Router();
const sumNum = (num1, num2) => num1 + num2;
router.get('/', (req, res) => {
    console.log(sumNum(5, 12));
    res.send('Hello');
});
module.exports = router;
