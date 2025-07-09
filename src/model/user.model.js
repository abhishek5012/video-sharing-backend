import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UserSchema=new Schema({
    username:{
        type:String,
        lowercase:true,
        required:true,
        trim:true,
        index:true,
        unique:true
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        trim:true,
         
        unique:true
       

    },
    fullname:{
        type:String,
        lowercase:true,
        required:true,
        trim:true,
        
       

    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video'
    }],
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshToken:{
        type:String
    }



},{timestamps:true})


 
UserSchema.pre('save',async function (next){
    if(!this.isModified('password')){return next();}

    this.password= await bcrypt.hash(this.password,10)

    next();
});

UserSchema.methods.isPasswordCorrect = async function(password){
   return  await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateAccessTokens=function(){

    return jwt.sign(
        {
        id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    `${process.env.ACCESS_TOKEN_SECRET}`,

    {expiresIn:`${process.env.ACCESS_EXPIRES}` }

)
};


UserSchema.methods.generateRefreshTokens=function(){
   return  jwt.sign(
        {
            id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
    `${process.env.REFRESH_TOKEN_SECRET}`,
    
{expiresIn:`${process.env.REFRESH_EXPIRES}` })
}




export const User = mongoose.model('User',UserSchema);