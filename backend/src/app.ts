import express, { Express } from "express";
import cors from 'cors';
import { configureCors } from "./config/cors-config";


import testRoutes from './routes/test';
import applyRoutes from './routes/apply-routes'


const app: Express = express();

app.use(cors(configureCors()));

app.use('/api', testRoutes);
app.use('/api/apply',applyRoutes)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is now running on port ', port);
});