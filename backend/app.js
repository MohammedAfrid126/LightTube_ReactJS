import express from 'express';
import connectToMongo from "./db.js";
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import videoRoutes from './routes/videos.js'
import commentRoutes from './routes/comments.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 5000;
app.use(cookieParser())
app.use(express.json())

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));


app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/comment', commentRoutes)


//Error handling 
app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Some thing went wrong"
    return res.status(status).json({
        success : false,
        status,
        message
    })
})



//Server is listening on port
app.listen(port,()=>{
    connectToMongo();
    console.log("Your server is listening @ http://localhost:"+port);
})