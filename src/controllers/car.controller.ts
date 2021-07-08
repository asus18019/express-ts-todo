import { Request, Response } from "express";
const userService = require('../services/user.service')
const carService = require('../services/car.service');
import { ICar } from "../services/car.service";
import { IUserID } from "../services/user.service";

class CarController {
    async createCarByUser(req: Request, res: Response): Promise<Response | undefined> {
        try {
            const userID: IUserID = userService.getAuthUserIDByToken(req);
            const car: ICar = await carService.createCar(req, userID.id);
            return res.json(car);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Create car error', errors: e});
        }
    }

    async getUserCars(req: Request, res: Response): Promise<Response | undefined> {
        try{
            const authUserID: IUserID = userService.getAuthUserIDByToken(req);
            const cars: ICar[] = await carService.getCars(authUserID.id);
             return res.json(cars);
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Get car error', errors: e});
        }
    }
}

module.exports = new CarController();