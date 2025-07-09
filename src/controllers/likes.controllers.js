import {Like} from '../model/likes.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Video } from '../model/video.model.js'
import { asynHandler } from '../utils/asyncHandler.js'


const toggleLikeVideo=asynHandler(async(req,res)=>{
try {
    
        const videoId= await Video.find({videoFile:req.query.video})
    
    
        const like=await Like.create({
            likedBy:req.user._id,
            video:videoId[0]._id
    
    
        })
    
        return res.status(200).json(new ApiResponse(200,like,"video is liked"))
} 
catch (error) {

    throw new ApiError(400,"something went wrong")
    
}




})


const toggleLikeComment=asynHandler(async(req,res)=>{
  try {
      
      const {commentId}= req.params;

     const like=await Like.find({likedBy:req.user._id,comment:commentId})
  
      if(like.length==0){
          const comment= await Like.create({comment:commentId,likedBy:req.user._id});
  
          return res.status(200).json( new ApiResponse(200,comment,"comments are liked"))
  
      }
      else{
          const id=like[0]._id;
  
           await Like.findByIdAndDelete(id)
  
          return res.status(200).json(new ApiResponse(200,"comment is unliked"))
          
          
      }
      
  
  
  } catch (error) {
    throw new ApiError(400,"something went wrong")
    
  }

})



const toggleLikeTweet=asynHandler(async(req,res)=>{
  try {
    console.log(1);
      const {tweetId} =req.params;
      const like =await Like.find({likedBy:req.user._id,tweet:tweetId});
  console.log(2);
  console.log(like);
      if(like.length==0){
          const tweet =await Like.create({tweet:tweetId,likedBy:req.user._id});
  
          return res.status(200).json(new ApiResponse(200,tweet,"tweet is liked successfully"))
      }
      else{
          const id=like[0]._id;
          await Like.findByIdAndDelete(id);
          return res.status(200).json(new ApiResponse(200,"tweet unliked successsfully"))
  
      }
      
  } 
  catch (error) {

    throw new ApiError(400,"something went wrong");
    
  }


})



const getLikedVideos=asynHandler(async(req,res)=>{
    // get the user name then the groupby  the videos field now here check if the video field is not null
    console.log(12);
    const likedVideos=await Like.aggregate([
        {
            $match:{
                likedBy:req.user._id
                // ,
                // comment:{$exists:false},  // if the value is not present in the database 
                // tweet:{$exists:false}

                // video:{$exists:true}   // n place of the fill aggregrate
            }

        },
        {
            $fill:{
                output:{
                    "video":{value:"missing"}
                }
            }
        },
        {
            $match:{
                video:{ $ne:"missing" }
            }
            
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
               
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
                        $addFields:{
                            owner:{$first:"$owner"}
                        }

                    },
                    {
                        $project:{
                            _id:1,
                            videoFile:1,
                            title:1,
                            views:1,
                            owner:1


                        }
                    }
                ],
                as:"videoInfo"
            }
        },
        {
            $addFields:{
                videoInfo:{$first:"$videoInfo"}
            }
        }
        ,
        {
            $replaceRoot:{newRoot:"$videoInfo"}

        }
    ])
  console.log(likedVideos);
console.log(10);
    return res.status(200).json(new ApiResponse(200,likedVideos,"sent successfully"))

})




export {
    toggleLikeTweet,
    toggleLikeComment,
    toggleLikeVideo,getLikedVideos
}