import { Types } from "mongoose";

export enum ticketStatus {
    OPEN = 'OPEN',
    PENDING = 'PENDING',
    CLOSED = 'CLOSED',
    RESOLVED = 'RESOLVED',
};

export enum ticketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
};

export enum ticketCategory {
    TECHNICAL = 'TECHNICAL',
    FINANCIAL = 'FINANCIAL',
    BUYING = 'BUYING',
    SELLING = 'SELLING',
};

export interface ITicket {
    category: ticketCategory,
    priority: ticketPriority,
    status: ticketStatus,
    message: string,
    assignedTo: Types.ObjectId,
    createdBy: Types.ObjectId,
    SLA: Date,
    active: boolean,
}

