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
Object.defineProperty(exports, "__esModule", { value: true });
const userService = require('../services/user.service');
const carService = require('../services/car.service');
const User = require('../models/user.model');
const express_validator_1 = require("express-validator");
class CarController {
    constructor() {
        this.createCarByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userID = userService.getAuthUserIDByToken(req);
                const car = yield carService.createCar(req, userID.id);
                return res.json(car);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Create car error', errors: e });
            }
        });
        this.getUserCars = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserID = userService.getAuthUserIDByToken(req);
                const cars = yield carService.getCars(authUserID.id);
                return res.json(cars);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Get car error', errors: e });
            }
        });
        this.deleteCarByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: errors });
                }
                const carID = req.body;
                const userID = userService.getAuthUserIDByToken(req);
                const userCars = yield User.findById(userID.id);
                if (!(yield carService.isCarBelongsToUser(userCars.cars, carID._id))) {
                    return res.status(400).json({ message: 'Car not belongs to auth user' });
                }
                const cars = yield carService.deleteCar(carID._id, userID.id);
                res.json(cars);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Delete car error', errors: e });
            }
        });
        this.updateCar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: errors });
                }
                const carID = req.body;
                const userID = userService.getAuthUserIDByToken(req);
                const userCars = yield User.findById(userID.id);
                if (!(yield carService.isCarBelongsToUser(userCars.cars, carID._id))) {
                    return res.status(400).json({ message: 'Car not belongs to auth user' });
                }
                const updatedCar = yield carService.updateCar(req, carID._id);
                res.json(updatedCar);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Delete car error', errors: e });
            }
        });
    }
}
module.exports = new CarController();
