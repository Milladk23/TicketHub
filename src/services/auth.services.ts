import jwt, { JwtHeader, JwtPayload, SignOptions } from 'jsonwebtoken';
import User from '../models/user.model';
import { sendEmail } from '../utils/email';
import crypto from  'crypto';
import fillterObj from '../utils/fillterObj';

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
    username: string,
    password: string,
    email?: string,
    passwordConfirm: string
}) => {
    if(
        !data.firstName || 
        !data.lastName ||
        !data.username || 
        !data.password ||
        !data.passwordConfirm
    ) {
        throw new Error('Please fill all the required fields');
    }
    if(data.password !== data.passwordConfirm) {
        throw new Error('Passwords are not the same');
    }

    const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password
    });

    return createSendToken(user);
}

export const login = async (data: { 
    username: string,
    password: string,
}) => {
    const user: any = await User.findOne({ username: data.username }).select('+password');

    if(!user) {
        throw new Error('No user with this username.');
    }

    if(!(await user.correctPassword(user.password, data.password))) {
        throw new Error('Wrong password');
    }

    return createSendToken(user);
}

export const protect = async (token: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const decodedUser: any = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decodedUser.id);

    if(!user) {
        throw new Error('The user blonging to this token does not exist anymore');
    }

    if((user as any).changePasswordAfter(decodedUser.iat)) {
        throw new Error('Password is changed recently please log in again');
    }

    return user;
}

export const getMe = async (myID: any) => {
    const me = await User.findById(myID);

    return me;
}

export const updateMyPassword = async (myID: any, data: {
    newPassword: string,
    passwordConfirm: string
}) => {

    if(!(data.newPassword === data.passwordConfirm)) {
        throw new Error('Passwords are not the same');
    }

    const me = await User.findByIdAndUpdate(myID);

    if(!me) {
        throw new Error('User not found');
    }

    me.password = data.newPassword;
    (me as any).changePasswordAt = Date.now();

    await me.save();

    return me;
}

export const updateMe = async (myID: any, data: {
    username?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    password?: string,
}) => {
    if(data.password) {
        throw new Error('For updating you password please use /updateMtPassword');
    }
    if(data.email) {
        throw new Error('For updating you email please use /emailVerification');
    }

    const newData: any = fillterObj(
        data,
        'username',
        'firstName',
        'lastName',
        'email',
    );

    const me = await User.findByIdAndUpdate(myID, newData , {
        runValidators: true,
        new: true,
    }); 

    return me;
}

export const verifyingEmailRequest = async (email: any) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const token = jwt.sign(
        { email: email, code },
        process.env.JWT_SECRET!,
        { expiresIn: '5m'}
    );

    await sendEmail(
        email,
        'Email Verifiacation',
        `Please enter this number to verify your email
        ${code}`,
    );

    return token;
};

export const verifyEmailCode = async (token: any, code: number, userID: any) => {
    try {
        console.log(token);
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(decoded.code, code);
        if(String(decoded.code) !== String(code)) return false;

        const user = await User.findById(userID);

        if(!user) return false;

        user.email = decoded.email;
        user.isEmailVerified = true;
        await (user as any).save();
        return true;
    } catch (err) {
        return false;
    }
}

export const forgotMyPassword = async (username: string, url: string) => {
    const user = await User.findOne({ username });
    if(!user) {
        throw new Error('There is no user with this username.')
    }
    const resetToken = (user as any).generateResetPasswordToken();
    const resetURL = `${url}/${resetToken}`;
    await user.save({ validateBeforeSave: false });

    try{
        await sendEmail(
        (user as any).email,
        'Password Reset',
        `For resetting your password open this Url
        ${resetURL}`,
    );

    return true;
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return false;
    }
}

export const resetPassword = async (
    token: string,
    password: string,
    passwordConfirm: string
) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if(!user) {
        throw new Error('Invalid or expired token');
    }

    if(!(password === passwordConfirm)) {
        throw new Error('Passwords are not the same');
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return createSendToken(user);
};

export const restrictTo = async (roles: [string], user: any) => {
    if(roles.includes((user as any).role)) {
        return true;
    }
    return false;
};;

