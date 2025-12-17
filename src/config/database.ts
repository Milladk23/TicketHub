import mongoose from "mongoose";

const dbURL = String(process.env.DB_URL);

export const connectDB = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log('Database has been connected.')
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}