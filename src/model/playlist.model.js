import mongoose,{Schema} from 'mongoose';

const playlistSchema=new Schema({
    videos:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    
    description:{
        type:String
        
    },
    owner:{
     type:Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type: String,
        required:true,
        unique:true
    }
},{
    timestamps:true
})


export const Playlist= mongoose.model("Playlist",playlistSchema)


