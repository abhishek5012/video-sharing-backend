import {Comment} from "../model/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asyncHandler.js"
import mongoose from "mongoose"

const addComment=asynHandler(async(req,res)=>{
    try {
        console.log(1);
        const {videoId}=req.params;
        console.log(videoId);
        console.log(typeof(videoId));
        console.log(typeof(req.user._id));
        console.log(req.user._id);

        
        console.log(2);
        const {writecomment} =req.body;
    console.log(3)

        const comment=await Comment.create({
            content:writecomment,
            video:videoId,
            owner:req.user?._id
             
        })
        

        return res.status(200).json(new ApiResponse(200,comment,"comment added successfully"))
    
    } catch (error) {
        throw new ApiError(400,"something went wrong")
    }


})

const deleteCommnet=asynHandler(async(req,res)=>{
try {
    
        const {commentID}=req.params
    
        await Comment.findByIdAndDelete(commentID);
        return res.status(200).json(new ApiResponse(200,"comment deleted successfully"))
        
} catch (error) {
    throw new ApiError(400,"comment not deleted")
    
}

})

const updateCommnet=asynHandler((async(req,res)=>{
    
try {
    
        const{updatedcontent} =req.body;
        const{commentID}=req.params
        const comment=await Comment.findByIdAndUpdate(commentID,{$set:{content:updatedcontent}},{new :true})
        return res.status(200).json(new ApiResponse(200,comment,"comment updated succesfully"))
        
    
} catch (error) {
    throw ApiError(400,"comment not updated")
    
}

}))

const getVideoComment=asynHandler(async(req,res)=>{
    try {

        
        const {videoID}=req.body
    console.log(videoID);
        const comment=await Comment.aggregate([
            {
                $match:{
                    video:new mongoose.Types.ObjectId(videoID)
                }
            },
            {
               $sort:{"createdAt":1}
            },
            {
                $group:{
                    _id:"video",
                    commentList:{
                        $push:{comment:"$content",time:"$createdAt"}
                    }
                    // ,

                    // userComment:
                    // {
                    //   $accumulator:
                    //   {
                    //     init: function() {                         
                    //       return  "";
                    //     },
                
                    //     accumulate: function(state, value) {  // Define how to update the state
                    //       if(value==req.user._id) return (state=value);
                    //         else return (state="");
                    //     },
                
                    //     accumulateArgs: ["$_id"],              // Argument required by the accumulate function
                
                    //     merge: function(state1, state2) {         // When the operator performs a merge,
                    //       return  (state1+state2).trim();
                    //     },
                
                    //     finalize: function(state) {               // After collecting the results from all documents,
                    //       return state.trim()        // calculate the average
                    //     },
                    //     lang: "js"
                    //   }
                    // }

                }
    
            },{
                $unset:"_id"
            },{
                $addFields:{
                    TotalComment:{$size:"$commentList"}
                }
            }
        ])
    console.log(34);
        return res.status(200).json(new ApiResponse(200,comment[0],"all the comment of teh asked videos are generated successfully"))
        
    } catch (error) {
        throw new ApiError(400,"something went wrong")
        
    }
})



export {
    addComment,
    deleteCommnet,
    updateCommnet,
    getVideoComment

}