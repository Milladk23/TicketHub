import mongoose from "mongoose";
import { ticketCategory, ticketPriority, ticketStatus, ITicket } from "../types/ticket.types";

const ticketSchema = new mongoose.Schema<ITicket>({
    category: {
        type: String,
        enum: Object.values(ticketCategory),
        required: [true, 'The ticket must have a category'],
    },
    status: {
        type: String,
        enum: Object.values(ticketStatus),
        default: ticketStatus.OPEN,
    },
    message: {
        type: String,
        required: [true, 'The ticket must have a message'],
    },
    priority: {
        type: String,
        enum: Object.values(ticketPriority),
        default: ticketPriority.LOW,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'The ticket must belong to a user'],
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    SLA: Date,
    active: Boolean
},
{
    timestamps: true,
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;