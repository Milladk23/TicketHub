import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import userRouter from './routes/user.routes';

const app = express();
dotenv.config({ path: 'config.env' });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRouter);

export default app;