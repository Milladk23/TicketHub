import { Request, Response, NextFunction } from 'express';
import * as userServices from '../services/user.services';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    }
    const token = await userServices.signup(data);

    res.status(200).json({
        status: 'succes',
        token,
    });
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
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

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        throw new Error('You are not logged in');
    }

    const user = await userServices.protect(token);

    (req as any).user = user;

    next();
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    const me = await userServices.getMe((req as any).user.id);

    res.status(200).json({
        status: 'success',
        me,
    });
};

export const updateMyPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await userServices.updateMyPassword((req as any).user.id, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Password has been updated succesfully',
        });
    } catch(err) {
         res.status(400).json({
            status: 'fail',
            err,
        });
    }
};

export const updateMe = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const me = await userServices.updateMe((req as any).user.id, req.body);

    res.status(200).json({
        status: 'success',
        me,
    });
}

export const verifyingEmailRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = await userServices.verifyingEmailRequest(req.body.email);

    res.status(200).json({
        status: 'success',
        message: 'use this route to enter the code and verify your email',
        token,
    });
}

export const verifyEmailCode = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = decodeURIComponent(req.params.token);
    const result = await userServices.verifyEmailCode(token, req.body.code, (req as any).user.id);
    if(result) {
        res.status(200).json({
            status: 'success',
            message: 'Your email has been verified successfully',
        });
    }
    else {
        res.status(500).json({
            status: 'fail',
            message: 'sth went wrong',
        }); 
    }
};