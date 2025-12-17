import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

const app = express();
dotenv.config({ path: 'config.env' });

connectDB();

export default app;