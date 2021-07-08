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
const car_model_1 = __importDefault(require("../models/car.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const userService = require('./user.service');
class CarService {
    constructor() {
        this.createCar = (req, userID) => __awaiter(this, void 0, void 0, function* () {
            const car = req.body;
            const newCar = yield new car_model_1.default({
                title: car.title,
                model: car.model,
                color: car.color,
                weight: car.weight
            });
            yield newCar.save();
            yield userService.setCarIDtoUser(userID, newCar);
            return newCar;
        });
        this.getCars = (userID) => __awaiter(this, void 0, void 0, function* () {
            const carsIds = yield user_model_1.default.findById(userID);
            let cars = [];
            for (const car of carsIds.cars) {
                let carObj = yield this.getCar(car);
                if (carObj !== null) {
                    cars.push(carObj);
                }
            }
            return cars;
        });
        this.isCarBelongsToUser = (cars, carID) => {
            let belongs = false;
            for (const car of cars) {
                if (car.toString() === carID) {
                    belongs = true;
                }
            }
            return belongs;
        };
        this.deleteCar = (carID, userID) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(userID);
            user.cars = user.cars.filter(car => car.toString() !== carID);
            yield user.save();
            yield car_model_1.default.findByIdAndDelete(carID);
            return yield this.getCars(userID);
        });
        this.getCar = (carID) => __awaiter(this, void 0, void 0, function* () { return car_model_1.default.findById(carID); });
    }
    updateCar(req, carID) {
        return __awaiter(this, void 0, void 0, function* () {
            let updates = req.body;
            // updates._id = undefined;
            delete updates._id;
            const car = yield car_model_1.default.findByIdAndUpdate(carID, updates);
            yield car.save();
            return yield this.getCar(carID);
        });
    }
}
module.exports = new CarService();
