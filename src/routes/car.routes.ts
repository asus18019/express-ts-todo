import Router from 'express';
import { check } from 'express-validator';
const carController = require('../controllers/car.controller');
const roleMiddleware = require('../middleware/role.middleware');
const router = Router();


router.post('/car', roleMiddleware(["USER", "ADMIN"]),[
    check('title', 'title is empty').isLength({min: 1}),
    check('model', 'model is empty').isLength({min: 1}),
    check('color', 'color is empty').isLength({min: 1}),
    check('weight', 'weight is empty').isLength({min: 1})
] ,carController.createCarByUser);

router.get('/car', roleMiddleware(["USER", "ADMIN"]), carController.getUserCars);

router.delete('/car', roleMiddleware(["USER", "ADMIN"]), [
    check('_id', 'car _id is empty').isLength({min: 1})
], carController.deleteCarByUser);

module.exports = router;