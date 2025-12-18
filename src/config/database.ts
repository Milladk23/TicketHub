import mongoose from "mongoose";



export const connectDB = async () => {
    try {
        const dbURL = String(process.env.DB_URL);
        
        if (!dbURL) {
            throw new Error('DB_URL is not defined in .env');
        }
        await mongoose.connect(dbURL);
        console.log('Database has been connected.')
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}