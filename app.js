import express from 'express';
import { config } from 'dotenv';
import ErrorMiddleWare from './Middlewares/Error.js';
import cookieParser from 'cookie-parser';
import user from './Routers/userRouters.js';
import products from './Routers/productRouters.js';
import order from './Routers/orderRouters.js';

config({
    path: "./config/config.env",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());

app.use("/api/v1", user);
app.use("/api/v1", products);
app.use("/api/v1", order);

export default app;
app.use(ErrorMiddleWare);
