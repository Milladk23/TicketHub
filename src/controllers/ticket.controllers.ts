import { Request, Response, NextFunction } from "express";
import * as ticketService from '../services/ticket.services';
import fillterObj from "../utils/fillterObj";

export const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.body;
    data.status = 'OPEN';
    data.createdBy = req.user.id;
    
    const ticket = await ticketService.createTicket(data);

    res.status(201).json({
        status: 'success',
        data: {
            ticket,
        }
    });
}

export const getMyAllTickets = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const tickets = await ticketService.getMyAllTickets(req.user.id);

    res.status(200).json({
        status: 'success',
        data: {
            result: tickets.length,
            tickets,
        },
    });
}

export const getMyOneTicket = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const ticket = await ticketService.getMyOneTicket(req.user.id, req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            ticket,
        },
    });
}

export const updateMyTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = fillterObj(req.body, 'message');

    const ticket = await ticketService.updateMyTicket(
        data,
        req.user.id,
        req.params.id
    );

    res.status(200).json({
        status: 'success',
        data: {
            ticket,
        },
    });
}

export const deleteMyTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await ticketService.deleteMyTicket(req.user._id, req.params.id);

    res.status(204).json({});
}