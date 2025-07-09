import {Playlist} from "../model/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import { asynHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose"


 


const createPlaylist = asynHandler(async(req,res)=>{
    try {
        const {name ,description}=req.body;

        if(!req.videos){
            return res.status(400).json(new ApiError(300,"none of the videos is selected for the playlist"))
        }

        const playlist=await Playlist.create({
            name:name,
            description:description,
            videos:req.videos,
            owner:req.user._id
        })

        return res.status(202).json(
            new ApiResponse(200,playlist,"successfully created playlist")
        )
    } 
    catch (error) {
        // return res.status(400).json( new ApiError(400,"something went wrong"))
        throw new ApiError(400,"somethinwent ")
        
    }
             

})

const addVideoToPlaylist= asynHandler(async(req,res)=>{
 try {
    
       
           if(!req.videos){
               return res.status(400).json(new ApiError(300,"none of the videos is selected for the playlist"))
           }
       
           // check whether we can use the direct instance of the database that is used inthe middlewares
   
           let presentVideo = req.playlist?.videos;
    //    as here the array is having the object id types.
           let newVideos=presentVideo.concat(req.videos);
           newVideos=newVideos.map((item)=>{ return item.toString()});

            let  newVis = newVideos.filter( (item,index)=>{ return newVideos.indexOf(item)==index; } )
            newVis=newVis.map(element => { return new mongoose.Types.ObjectId(element)});
           const playlist= await Playlist.findByIdAndUpdate(req.playlist?._id,  {$set:{videos:newVis}} , {new:true} );
   
       
           return res.status(200).json(new ApiResponse(201,playlist," video in playlist added successfully"));
       
       
 } catch (error) {
    throw new ApiError(400,"something went wrong")
    
 }

    
})


const deletePlaylist=asynHandler(async(req,res)=>{
    // firstly verify the playlist usng the middleware
    // then with the id remove that play list frm the database
    // 
    try {
        
        await Playlist.findByIdAndDelete(req.playlist?._id);
        return res.status(200).json(new ApiResponse(201,"deleted successfully"))

    } catch (error) {
        throw new ApiError(400,"playlist is not get deleted")
    }

})


const getUserPlaylist=asynHandler(async(req,res)=>{
    // the user is logged in we get the user id
try {
    console.log(1);
        const playlist =await Playlist.aggregate([
            {
                $match:{
                    owner:req.user?._id
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"videos",
                    foreignField:"_id",
                    as:"videos",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner",
                                pipeline:[
                                    {
                                        $project:{
                                            username:1,
                                            avatar:1
                                        }
                                    }
                                ] 
                            }
                        },
                        {
                            $set:{
                                owner:{$first:"$owner"}
                            }
                        },
                        {
                            $addFields:{
                                username:"$owner.username",
                                avatar:"$owner.avatar"
                            }
                        },
    
    
                        {
    
                            $project:{
                                videoFile:1,
                                thumbnail:1,
                                duration:1,
                             
                                username:1,
                                avatar:1
                                 
                            }
                        }
                    ]
    
                     
                }
    
            },
            {
               $set:{
                videoCount:{$size:"$videos"}
               }
    
            }
        ])
        console.log(2);

        return res.status(200).json(new ApiResponse(200,playlist,"successfully finded"))
    
} catch (error) {
    throw new ApiError(404,"unable to find")
    
}





})



const updatePlaylist=asynHandler(async(req,res)=>{
try {
    
        const {name,description}=req.body;
    
        const playlist=await Playlist.findByIdAndUpdate(req.playlist?._id,  {$set:  {name:name,description:description }},{new:true}  );
         
        return res.status(200).json(new ApiResponse(200,playlist,"playlist updated successfully"));
        
    } 
    catch (error) {
         throw new ApiError(400,"couldn't update the playlist");
    
   }
})


export {
    createPlaylist,
    updatePlaylist,
    getUserPlaylist,
    deletePlaylist,
    addVideoToPlaylist

}
