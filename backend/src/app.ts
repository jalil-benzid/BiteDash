import express, {Express} from "express";
import testRoutes from './routes/test'




const app: Express = express();



app.use('/api',testRoutes)


const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log('Server is now running in port ',port)
})

