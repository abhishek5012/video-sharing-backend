import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

//  import {app } from "./index.js"

// assigning the middleware or the 

app.use(cors({
    origin:process.env.CORS_ORI,
    credentials:true
}))

app.use(express.json({limit:"16Kb"}))
app.use(express.urlencoded({extended:true,limit:"16Kb"}))
app.use(express.static('public'));
app.use(cookieParser());


// importing the router

app.get('/',(req,res)=>{ 
    console.log("yes we are in");
    res.json({message:"it id ok."})
})


import userRouter from './route/user.router.js';
import commentRouter from './route/comment.router.js'
import likeRouter from './route/like.router.js'
import playlistRouter from './route/playlist.router.js'
import tweetRouter from './route/tweet.router.js'


app.use("/api/v1/user",userRouter);

app.use("/api/v1/comment",commentRouter);

app.use("/api/v1/like",likeRouter);

app.use("/api/v1/playlist",playlistRouter);

app.use("/api/v1/tweet",tweetRouter);




export {app}



