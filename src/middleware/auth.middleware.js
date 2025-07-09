import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import {User} from "../model/user.model.js";
import {asynHandler} from '../utils/asyncHandler.js'

// cookie parser middleware work main work
function check(value){
value=value.replaceAll("; ",",").replaceAll("=",":");
const be=value.split(",");
const arr=[];
be.forEach(function(item) {
     arr.push(item.split(":"));
});
return Object.fromEntries(arr);
}


export const verifyJWT = asynHandler(async(req,res,next)=>{
   try {
    
     const accessToken= req.cookie?.AccessToken || req.header("Authorization")?.replace("Bearer ","") || check(`${req.header("Cookie")}`)?.AccessToken;
     const k=req.header("Cookie");
    //  console.log(accessToken);
    //  console.log("headers ",req.headers.Cookie); //un

    //  console.log(k); //on
    //  console.log(req.cookie); //un 
    //  console.log("the  ",accessToken);  //un 
    //  console.log("ewer");
    // console.log("below is the ");
    // console.log(req.header);

     if(!accessToken){
         throw new ApiError(400,"user is not led in");
     }
 
     const decodedUser= await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    //  if(!decodedUser) {throw new ApiError(404,"user is not logged inn ")}
 
 const user= await User.findById(decodedUser?.id).select("-password -refreshToken");

 if(!user){
     throw new ApiError(400,"user is not logged in");
 }
 console.log(user);
//  setting the value of the headers (customized the headers)
 req.user=user;
 console.log("5678789");
 next();

   } catch (error) {
    throw new ApiError(400,error?.message||"can;t verify ")
    
   }

})

export default check;