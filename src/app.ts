import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config({ path: 'config.env' });

export default app;