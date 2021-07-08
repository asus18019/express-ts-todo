import Router from 'express';
const carController = require('../controllers/car.controller');
const router = Router();
import { check } from 'express-validator';


router.post('/car', [
    check('title', 'title is empty').isLength({min: 1}),
    check('model', 'model is empty').isLength({min: 1}),
    check('color', 'color is empty').isLength({min: 1}),
    check('weight', 'weight is empty').isLength({min: 1})
] ,carController.createCarByUser);

router.get('/car', carController.getUserCars);

router.delete('/car', [
    check('_id', 'car _id is empty').isLength({min: 1})
], carController.deleteCarByUser);

module.exports = router;