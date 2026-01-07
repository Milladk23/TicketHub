import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from  'crypto';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: [3, 'First name must have a 3 charracters or more'],
        required: [true, 'User must have a first name'],
    },
    lastName: {
        type: String,
        minLength: [3, 'First name must have a 3 charracters or more'],
        required: [true, 'User must have a first name'],
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter real email'],
        lowercase: true,
        sparse: true,
    },
    isEmailVerified: Boolean,
    password: {
        type: String,
        minLength: [8, 'Password must have a 8 charracters or more'],
        required: [true, 'User must have a password'],
        select: false,  
    },
    passwordResetToken: String,
  passwordResetExpires: Date,
    role: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        default: 'user',
    },
    changePasswordAt: Date,
    },
    {
    timestamps: true,
    }
);

userSchema.pre('save', async function() {
    if(!this.isModified('password')) return ;

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function(
    candidatePassword: string,
    userPassword: string,
    ){
    return await bcrypt.compare(userPassword, candidatePassword);
}

userSchema.methods.changePasswordAfter = function (JWTTimeStamps: any) {
    if(this.changePasswordAt) {
        const changeTimestamp = parseInt (
            String(this.changePasswordAt.getTime() / 1000),
            10  
        );
        if (changeTimestamp > JWTTimeStamps) return true;
    }

    return false;
}

userSchema.methods.generateResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

export default User;