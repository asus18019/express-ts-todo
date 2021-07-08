"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const carController = require('../controllers/car.controller');
const roleMiddleware = require('../middleware/role.middleware');
const router = express_1.default();
router.post('/car', roleMiddleware(["USER", "ADMIN"]), [
    express_validator_1.check('title', 'title is empty').isLength({ min: 1 }),
    express_validator_1.check('model', 'model is empty').isLength({ min: 1 }),
    express_validator_1.check('color', 'color is empty').isLength({ min: 1 }),
    express_validator_1.check('weight', 'weight is empty').isLength({ min: 1 })
], carController.createCarByUser);
router.get('/car', roleMiddleware(["USER", "ADMIN"]), carController.getUserCars);
router.delete('/car', roleMiddleware(["USER", "ADMIN"]), [
    express_validator_1.check('_id', 'car _id is empty').isLength({ min: 1 })
], carController.deleteCarByUser);
router.put('/car', [
    express_validator_1.check('_id', 'car _id is empty').isLength({ min: 1 })
], roleMiddleware(["USER", "ADMIN"]), carController.updateCar);
module.exports = router;
