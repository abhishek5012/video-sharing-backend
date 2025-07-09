import mongoose ,{Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const videoSchema=new Schema({
    videoFile:{
        type:String,
        required:true,  //cloudinary stored files
        
    },
    thumbnail:{
        required:true,
        type:String
    },
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
    duration:{
        required:true,  //cloudnary
        type:Number
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model('Video',videoSchema);