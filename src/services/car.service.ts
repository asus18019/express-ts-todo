import { Request } from "express";
import { Document } from "mongoose";
import Car from '../models/car.model';
import User from '../models/user.model';
import {IUser} from "../controllers/user.controller";
const userService = require('./user.service');

// @ts-ignore
export interface ICar extends Document {
    title: string,
    model: string,
    color: string,
    weight: number
}

export interface ICarsIds {
    cars: string[]
}

interface ICarUpdates {
    _id?: string,
    title?: string,
    model?: string,
    color?: string,
    weight?: number
}

interface ICarService {
    createCar(req: Request, userID: string): Promise<ICar>,
    getCars(userID: string): Promise<object[]>,
    isCarBelongsToUser(cars: string[], carID: string): boolean,
    deleteCar(carID: string, userID: string): Promise<object[]>,
    getCar(carID: string): Promise<ICar>,
    updateCar(req: Request, carID: string): Promise<ICar>
}

class CarService implements ICarService{
    createCar = async (req: Request, userID: string): Promise<ICar> => {
        const car: ICar = req.body;
        const newCar: ICar = await new Car({
            title: car.title,
            model: car.model,
            color: car.color,
            weight: car.weight
        })
        await newCar.save();
        await userService.setCarIDtoUser(userID, newCar);
        return newCar;
    };

    getCars = async (userID: string): Promise<object[]> => {
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

    isCarBelongsToUser = (cars: string[], carID: string): boolean => {
        let belongs: boolean = false;
        for (const car of cars) {
            if(car.toString() === carID) {
                belongs = true;
            }
        }
        return belongs;
    }

    deleteCar = async (carID: string, userID: string): Promise<object[]> => {
        const user: IUser = await User.findById(userID);
        user.cars = user.cars.filter(car => car.toString() !== carID);
        await user.save();
        await Car.findByIdAndDelete(carID);
        return await this.getCars(userID);
    }

    updateCar = async (req: Request, carID: string): Promise<ICar> => {
        let updates: ICarUpdates = req.body;
        delete updates._id;
        const car = await Car.findByIdAndUpdate(carID, updates);
        await car.save()
        return await this.getCar(carID);
    }

    getCar = async(carID: string): Promise<ICar> => Car.findById(carID);

}

module.exports = new CarService();