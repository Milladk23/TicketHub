import User from "../models/user.model";
import Agent from "../models/agent.model";
import { agentCategory } from "../types/agent.types";
import fillterObj from "../utils/fillterObj";

export const getAllUsers = async () => {
    const users = await User.find({role: 'user'});

    return users;
}

export const promotingToAgent = async (userId: string, categories: agentCategory[]) => {
    const user = await User.findById(userId);

    if(!user) {
        throw new Error('There is no user with this ID.');
    }

    user.role = 'agent';
    const agent = await Agent.create({
        user: user._id,
        categories,
    });

    await user.save();
    return agent.populate('user');
}

export const creatUser = async (data: {
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    email?: string,
    isEmailVerified?: boolean,
    role?: string,
    categories?: agentCategory[],
}) => {
    const categories = data.categories;
    const newData = fillterObj(
        data,
        'username',
        'firstName',
        'lastName',
        'password',
        'email',
        'isEmailVerified',
        'role'
    );

    const user = await User.create(newData);
    if((user as any).role === 'agent') {
        const agent = await Agent.create({
            user: (user as any)._id,
            categories,
        });
        
        return agent.populate('user');
    }

    return user;
};

export const deleteUser = async (userId: string) => {
    await User.findByIdAndDelete(userId);

    return;
}

export const getUser = async (userId: string) => {
    const user = await User.findById(userId);

    if(!user) {
        throw new Error('There is no user with this ID.');
    }

    return user;
}