import mongoose, { Schema } from "mongoose";
import { IAgent } from "../types/agent.types";

const agentSchema = new mongoose.Schema<IAgent>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    categories: {
        type: [String],
    },
},
{
    timestamps: true,
});

const Agent = mongoose.model<IAgent>('Agent', agentSchema);

export default Agent;