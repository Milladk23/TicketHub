import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';

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
    },
    phoneNumber: {
        type: String,
        required: [true, 'User must have a phonr number'],
        validate: function (v: string) {
            return /^\d{10}$/.test(v);
        }, 
        message: (prop: any) => `${prop.value} is not a valid 9-digit phone number`
    },
    password: {
        type: String,
        minLength: [8, 'Password must have a 8 charracters or more'],
        required: [true, 'User must have a password'],
        select: false,  
    },
    role: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        default: 'user',
    },
}, {
    toJSON: {
        transform(doc, ret) {
            if(ret.phoneNumber) {
                ret.phoneNumber = 
                    ret.phoneNumber.slice(0, 3) +
                    '****' +
                    ret.phoneNumber.slice(-3);
            }
        }
    },
    timestamps: true,
});

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

const User = mongoose.model('User', userSchema);

export default User;