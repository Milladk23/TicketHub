import * as userServices from '../services/user.services';
import { Request, Response, NextFunction } from 'express';

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const users = await userServices.getAllUsers();

    res.status(200).json({
        status: 'success',
        data: {
            results: users.length,
            users,
        },
    });
};

export const promotingToAgent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const agent = await userServices.promotingToAgent(req.params.id, req.body.categories);

    res.status(200).json({
        status: 'success',
        agent,
    })
};

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const user = await userServices.getUser(req.params.id);

    res.status(200).json({
        status: 'success',
        user,
    });
}

export const creatUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const user = await userServices.creatUser(req.body);

    res.status(200).json({
        status: 'success',
        user,
    });
}

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await userServices.deleteUser(req.params.id);

    res.status(200).json({});
}
