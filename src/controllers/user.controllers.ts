import { Request, Response, NextFunction } from 'express';
import * as userServices from '../services/user.services';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        phoneNumber: req.body.phoneNumber,
    }
    const token = await userServices.signup(data);

    res.status(200).json({
        status: 'succes',
        token,
    });
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.username);
    const data = {
        username: req.body.username,
        password: req.body.password,
    }

    const token = await userServices.login(data);

    res.status(200).json({
        status: 'succes',
        token,
    });
}