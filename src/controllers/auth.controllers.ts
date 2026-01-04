import { Request, Response, NextFunction } from 'express';
import * as authServices from '../services/auth.services';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    }
    const token = await authServices.signup(data);

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

    const token = await authServices.login(data);

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

    const user = await authServices.protect(token);

    req.user = user;

    next();
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    const me = await authServices.getMe(req.user?.id);

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
        await authServices.updateMyPassword(req.user?.id, req.body);

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
    const me = await authServices.updateMe(req.user?.id, req.body);

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
    const token = await authServices.verifyingEmailRequest(req.body.email);

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
    const result = await authServices.verifyEmailCode(token, req.body.code, req.user?.id);
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

export const forgottPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword`;
    const result: boolean = await authServices.forgotMyPassword(req.body.username, url);
    if(result) {
        res.status(200).json({
            status: 'success',
            message: 'Url has been sent to your Email please use it to reset your password',
        });
    }else {
        res.status(500).json({
            status: 'fail',
            message: 'something went wrong',
        });
    }
}

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const resetToken = decodeURIComponent(req.params.token);
    const token = await authServices.resetPassword(
        resetToken,
        req.body.password,
        req.body.passwordConfirm,
    );
    res.status(200).json({
        status: 'succes',
        token,
    });
}

export const restrictTo = (...roles: [string]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        if(!authServices.restrictTo(roles, req.user)){
            throw new Error('You do not the premission');
        }

        next();
    }
}