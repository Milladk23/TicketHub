import { Types } from "mongoose"
import Ticket from "../models/ticket.model"

export const createTicket = async (data: {
    message: string,
    createdBy: Types.ObjectId,
    status: 'OPEN',
    category: string,
    priority: string,
}) => {
    const ticket = await Ticket.create(data);

    return ticket;
}

export const getMyAllTickets = async (id: string) => {
    const tickets = await Ticket.find({ createdBy: id });

    return tickets;
}

export const getMyOneTicket = async (
    userId: string,
    ticketId: string,
) => {
    const ticket = await Ticket.findById(ticketId);
    
    if(!ticket) {
        throw new Error('There is no ticket with this ID.')
    }

    if(!(ticket?.createdBy.equals(userId))) {
        throw new Error('This not your ticket.');
    }

    return ticket;
}


export const updateMyTicket = async (
    data: {
        message: string,
    },
    userId: string,
    ticketId: string
) => {
    const ticket = await Ticket.findById(ticketId);

    if(!ticket) {
        throw new Error('There is no ticket with this ID.')
    }

    
    if(!(ticket?.createdBy.equals(userId))) {
        throw new Error('This not your ticket.');
    }

    ticket.message = data.message;
    await ticket.save();

    return ticket;
};

export const deleteMyTicket = async (
    userId: string,
    ticketId: string
) => {
    const ticket = await Ticket.findById(ticketId);

    if(!ticket) {
        throw new Error('There is no ticket with this ID.')
    }
    
    if(!(ticket?.createdBy.equals(userId))) {
        throw new Error('This not your ticket.');
    }

    ticket.active = false;
    await ticket.save();

    return ticket;
};