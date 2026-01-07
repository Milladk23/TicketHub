import { Types } from "mongoose";

export enum agentCategory {
    TECHNICAL = 'TECHNICAL',
    FINANCIAL = 'FINANCIAL',
    BUYING = 'BUYING',
    SELLING = 'SELLING',
};

export interface IAgent {
    user: Types.ObjectId,
    ratingsAverage: number,
    ratingsQuantity: number,
    categories: [agentCategory],
}