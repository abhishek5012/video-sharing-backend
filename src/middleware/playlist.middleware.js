import {Playlist} from "../model/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import { asynHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose"



const selectVideosFromUser= asynHandler(async(req,res,next)=>{

const SelectedVideos=req.body.SelectedVideos;

    req.videos=SelectedVideos.map(element => { return new mongoose.Types.ObjectId(element)});
    console.log(234566);
    next();
    
})


// firstly user logged in // then check for the playlist exist // then select the videos

const verifyPlaylist=asynHandler(async(req,res,next)=>{
console.log(10);
    const {Id}=req.params;
console.log(1);
    if(!Id) {
        // return res.status(400).json(new ApiError(400,"playlist not found"))
        throw new ApiError(400,"playlist id not found");
    }
console.log(3)
    const playlist=await Playlist.findById(Id);
    
    if(!playlist){
        throw new ApiError(400,"playlist not foound")
    }
    
    req.playlist=playlist;
    console.log(4);

    next();

})

export {
    selectVideosFromUser,verifyPlaylist
    

}







