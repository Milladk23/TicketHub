import { Request, Response, NextFunction } from 'express';
import * as userServices from '../services/user.services';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
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