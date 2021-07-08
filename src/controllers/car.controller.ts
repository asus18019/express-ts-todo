import { Request, Response } from "express";
const userService = require('../services/user.service')
const carService = require('../services/car.service');
import { ICar, ICarsIds } from "../services/car.service";
import { IUserID } from "../services/user.service";
const User = require('../models/user.model');
import {Result, ValidationError, validationResult} from "express-validator";

interface ICarId {
    _id: string
}

interface ICarController {
    createCarByUser(req: Request, res: Response): Promise<Response | undefined>,
    getUserCars(req: Request, res: Response): Promise<Response | undefined>,
    deleteCarByUser(req: Request, res: Response): Promise<Response | undefined>
}

class CarController implements ICarController{
    createCarByUser = async (req: Request, res: Response): Promise<Response | undefined> => {
        try {
            const userID: IUserID = userService.getAuthUserIDByToken(req);
            const car: ICar = await carService.createCar(req, userID.id);
            return res.json(car);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Create car error', errors: e});
        }
    }

    getUserCars = async (req: Request, res: Response): Promise<Response | undefined> => {
        try{
            const authUserID: IUserID = userService.getAuthUserIDByToken(req);
            const cars: ICar[] = await carService.getCars(authUserID.id);
            return res.json(cars);
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Get car error', errors: e});
        }
    }

    deleteCarByUser = async (req: Request, res: Response): Promise<Response | undefined> => {
        try {
            const errors: Result<ValidationError> = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: errors});
            }

            const carID: ICarId = req.body;
            const userID: IUserID = userService.getAuthUserIDByToken(req);
            const userCars: ICarsIds = await User.findById(userID.id)
            if(!await carService.isCarBelongsToUser(userCars.cars, carID._id)){
                return res.status(400).json({message: 'Car not belongs to auth user'});
            }
            const cars: ICar[] = await carService.deleteCar(carID._id, userID.id);
            res.json(cars);
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Delete car error', errors: e});
        }
    }
}

module.exports = new CarController();