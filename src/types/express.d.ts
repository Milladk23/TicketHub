import { IUser } from '../modules/users/user.interface';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export interface UserT extends IUser {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  email?: string,
  isEmailVerified: boolean,
  password: string,
  passwordResetToken: string,
  passwordResetExpires: Date,
  role: string,
  changePasswordAt: Date,
  correctPassword(candidatePassword: string, userPassword: string,): boolean,
  changePasswordAfter(JWTTimeStamps: any): boolean,
  generateResetPasswordToken(): string,
}

export type UserType = Partial<User>;