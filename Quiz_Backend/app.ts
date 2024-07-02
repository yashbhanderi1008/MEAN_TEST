import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
import connectDB from './src/db/connection';
import userRoute from './src/routes/UserRoute';
dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')))
connectDB();

app.use('/user', userRoute);

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})