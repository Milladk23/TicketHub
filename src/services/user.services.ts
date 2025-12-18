import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/user.model';

interface JwtPayload {
    id: string;
}

const signToken = (id: any) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const expiresIn = process.env.JWT_EXPIRES_IN || '90d';


    return jwt.sign({ id } as object, secret, { expiresIn } as SignOptions);
}

const createSendToken = (user: any) => {
    const token = signToken(user.id);

    return token;
}

export const signup = async (data: {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    password: string,
    email?: string,
    passwordConfirm: string
}) => {
    if(
        !data.firstName || 
        !data.password ||
        !data.passwordConfirm || 
        !data.lastName ||
        !data.phoneNumber
    ) {
        throw new Error('Please fill all the required fields');
    }
    if(data.password !== data.passwordConfirm) {
        throw new Error('Passwords are not the same');
    }

    const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        password: data.password
    });

    return createSendToken(user);
}