import { Request, Response } from "express";
import { Document } from "mongoose";
import Car from '../models/car.model';
import User from '../models/user.model';
const userService = require('./user.service');

// @ts-ignore
export interface ICar extends Document {
    title: string,
    model: string,
    color: string,
    weight: number
}

interface ICarsIds {
    cars: string[]
}

class CarService {
    async createCar(req: Request, userID: string): Promise<ICar> {
        const car: ICar = req.body;
        const newCar: ICar = new Car({
            title: car.title,
            model: car.model,
            color: car.color,
            weight: car.weight
        })
        await newCar.save();
        await userService.setCarIDtoUser(userID, newCar);
        return newCar;
    };

    async getCars (userID: string): Promise<object[]> {
        const carsIds: ICarsIds = await User.findById(userID);
        let cars: object[] = [];
        for (const car of carsIds.cars) {
            let carObj: ICar = await this.getCar(car)
            if(carObj !== null){
                cars.push(carObj);
            }
        }
        return cars;
    }

    getCar = async(carID: string): Promise<ICar> => Car.findById(carID);

}

module.exports = new CarService();