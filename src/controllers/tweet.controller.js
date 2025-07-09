import {Tweet} from "../model/tweets.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asyncHandler.js"

const createTweet=asynHandler(async(req,res)=>{
    try {
        
        const {content}=req.body
        console.log(7);
        const tweet=await Tweet.create({
            content:content,
            owner:req.user?._id
        })
    
        return res.status(200).json(new ApiResponse(200,tweet,"tweet created successfully"))
    
    
    } catch (error) {
        throw new ApiError(400,"something went wrong")
        
    }
})

const deleteTweet=asynHandler(async(req,res)=>{
try {
    
        const {tweetID}=req.params;
        await Tweet.findByIdAndDelete(tweetID)
    
        return res.status(200).json(new ApiResponse(200,"deleted successfully"))
        
} catch (error) {
    throw new ApiError(400,"something went wrong")
    
}
})

const updateTweet=asynHandler(async(req,res)=>{
try {
    
        const {tweetID} =req.params
        const {Ncontent} =req.body
    
        const tweet=await Tweet.findByIdAndUpdate(tweetID,{content:Ncontent},{new:true})
        return res.status(200).json(new ApiResponse(200,tweet,"tweet updated successfully"))
        
} catch (error) {
    throw new ApiError(400,"something went wrong")
    
}
})

const editTweet=asynHandler(async(req,res)=>{
    try {
        
        const {tweetID}=req.params
        const{edittedContent}=req.body
        const tweet = await Tweet.findById(tweetID);
        tweet.content=`${tweet.content} ${edittedContent}`;
        await tweet.save({validationBeforeSave:false});

        const updated = await Tweet.findById(tweetID);
        return res.status(200).json(new ApiResponse(200,updated,"tweet edited successfullly"))
    
    } catch (error) {
        throw new ApiError(400,"tweet not edited ")
        
    }

})

const getUserTweet=asynHandler(async(req,res)=>{
try {
    console.log(req.user._id);
    console.log(typeof(req.user._id));
    
        const UserTweets=await Tweet.aggregate([
            {
               
                $match:
                {
                    owner:  req.user?._id
                }
            },
            {
                $group:{
                    _id:"_id",
                    Tweets:{
                        $push:{tweet:"$content",lastUpdated:"$updatedAt"}
                    }
                }
            },
            {
                $addFields:{
                    TotalTweets:{
                        $size:"$Tweets"
                    }
                }
            },
            {
                $unset: "_id"
    
            }
    
        ])

        /*
        OR 
        const userTweets=Tweet.find({_id:req.user._id})
        
        now return the array of the document of the tweets.
        */
        console.log(UserTweets[0]);
        return res.status(200).json(new ApiResponse(200,UserTweets[0],"user tweets generated successfully"))
    
    
} catch (error) {
    
    throw new ApiError(400,"something went wrong in fetching the tweets")
}
})


export {createTweet,
    deleteTweet,
    updateTweet,
    editTweet,
    getUserTweet
}