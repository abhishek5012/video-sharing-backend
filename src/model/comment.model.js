import mongoose ,{Schema} from "mongoose"


const commentSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    // both the moongoose.objectId is same as the mongoose.schema.types.objectid
    video:{
        type:mongoose.ObjectId,
        ref:"Video"
    }
},{
    timestamps:true
})

export const Comment=mongoose.model("Comment",commentSchema);