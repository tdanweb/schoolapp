import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()


import bcrypt from "bcrypt"
import connectDB from './db.js';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true
  })
);

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true  
}));


//using routes
import userRoutes from './routes/Users.js';
import mediaRoutes from './routes/mediaRoute.js';
import settingRoutes from './routes/SettingRoute.js';
import studentRoutes from './routes/StudentRoute.js';
import appRoutes from './routes/ApplicantRoute.js';
import dutiesRoute from './routes/StaffDutiesRoute.js';
import resultsRoute from './controllers/ResultControls.js';
import docRouter from './controllers/StaffDocControl.js';


app.use("/api", docRouter)
app.use('/api', userRoutes)
app.use("/api", dutiesRoute)
app.use("/api", appRoutes)
app.use("/api", settingRoutes)
app.use("/api/results", resultsRoute)
app.use("/api/media", mediaRoutes)
app.use("/api", studentRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

