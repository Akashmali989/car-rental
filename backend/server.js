import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {db} from './src/config/db.js';
import router from './src/routes/authRoutes.js';
import carRouter from './src/routes/carRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', router);
app.use('/api/cars', carRouter);

app.get('/', (req, res) => {
    res.json({
        message : 'Car Rental API is running'
    });
});



const port = process.env.PORT || 5000;

app.listen(port, async ()=> {
    console.log(`Server is running on http://localhost:${port}`);

    try {
        const connection = await db.getConnection();
        console.log("MySQL connected successfully");
        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
});