import {asynHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js';
import {User} from "../model/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {Video} from '../model/video.model.js'

import check from "../middleware/auth.middleware.js";

const generateAccessAndRefreshToken=(async(user_id)=>{
      try {
            const user=await User.findById(user_id);
      
            const AccessToken=await user.generateAccessTokens();
            const RefreshToken=await user.generateRefreshTokens();
            
            user.refreshToken=RefreshToken;
            user.save({validationBeforeSave:true})
            return {AccessToken, RefreshToken};
      } 
      catch(error) {
            throw new ApiError(500,"something went wrong")

            
      }


})

const registerUser = asynHandler( 

async(req,res)=>{
     
      console.log("1ee")

      const {username,email,fullname,password} = req.body
      
      if([username,email,password,fullname].some((val)=>val?.trim()==="")){
            throw new ApiError(400,"all infomation is required");
      }
      console.log("2ee");
// here we can add extra functionaluty valdations

      const existedUser= await User.findOne({
            $or:[{username:username},{fullname:fullname} ]
      })
      console.log("3ee")
      if(existedUser) {
            throw new ApiError(300,"user name or email is registered ")
      }

      console.log("4ee")

// due to the multer is added into the middlewares
       console.log(req.files.avatar)
       console.log("now the next value")
       console.log(req.files)
      const avatarLocalPath=req.files?.avatar[0]?.path;
      console.log("5ee")
      const coverImageLocalPath=req.files?.coverImage[0]?.path

      if(!avatarLocalPath){ throw new ApiError(400,"avatar is required")}

      const avatar= await uploadOnCloudinary(avatarLocalPath);

      const coverImage = await uploadOnCloudinary(coverImageLocalPath);

      if(!avatar) {throw new ApiError(402,"something went wroun")}

      
      const user=await User.create({
            username:username,
            fullname:fullname,
            avatar:avatar.url,
            coverImage:coverImage?.url ||" ",
            password:password,
            email:email,

           })

      //      user.password="abhijug123";
      //      user.save({validationBeforeSave:true})


           const CreatedUser= await User.findById(user._id).select(
            "-password -refreshToken"
           )

           if(!CreatedUser){throw new ApiError(400,"something went wrojg")}


           return res.status(201).json(
            new ApiResponse(200,CreatedUser,"user register")
           )

       
   

}

)
const loginUser= asynHandler(async(req,res)=>{

      const {username,email,password} =req.body;

      if(!username && !email){
            throw new ApiError(400,"username or email is required");
      }
     const user=await User.findOne({
            $or:[{username},{email}]
      })

      if(!user){
            throw new ApiError(404,"user not found")
      }

      const isPasswordCorrect= await user.isPasswordCorrect(password);
      if(!isPasswordCorrect){
            throw new ApiError(403,"password is incorrect")
      }
      

     const {AccessToken, RefreshToken}= await generateAccessAndRefreshToken(user._id);
      const options={
            httpOnly:true,
            secure:true
      }
      // just to find the refresh and the access token in the database we have done the new find 
      const loggedInuser=await User.findById(user._id);

      // console.log(RefreshToken);
      //       console.log(AccessToken);
            
      
     return res.status(200).cookie("AccessToken",AccessToken,options).cookie("RefreshToken",RefreshToken,options).json(new ApiResponse(200,{
           user:loggedInuser,RefreshToken:RefreshToken,AccessToken:AccessToken
      },"logged in"))


})

const loggedOut =asynHandler(async(req,res)=>{
      try {
            console.log(300);

            const user= await User.findById(req.user._id);
            
            user.refreshToken=undefined;
           await user.save({validationBeforeSave:true});
            
            console.log(user);
            const options={
                  httpOnly:true,
                  secure:true
            }
      
            return res.status(200).clearCookie("AccessToken",options).clearCookie("RefreshToken",options).json({
                  message:"user is logged out"
            })
      } catch (error) {
            throw new ApiError(400,"not done ")
      }
})

const refreshAccessToken=asynHandler(async(req,res)=>{
      try {
            
            const refreshToken =check(  `${req.header("Cookie")}`  )?.RefreshToken || req.body.RefreshToken;
      
            if(!refreshToken) {throw new ApiError(400,"user is not logged in ")}
            
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            
            const user=await User.findById(decoded?.id);

      if(!user){
            throw new ApiError(400,"invalid credentials")
      }
            if(refreshToken!=user.refreshToken){
                  throw new ApiError(400,"invalid credentials")
            }
            
      
            const {AccessToken,RefreshToken} = await generateAccessAndRefreshToken(user._id)
            
            const options ={
                  httpOnly:true,
                  secure:true
            }


      
            return res.status(200).cookie("AccessToken",AccessToken,options).cookie("RefreshToken",RefreshToken,options).json({
                  AccessToken,RefreshToken
            })
      
      } catch (error) {
            throw new ApiError(400,error?.message || "try again refreshub or invalid credentials")
            
      }





})


// how to validate???>
const changeCurrentPassword=asynHandler(async(req,res)=>{
// firstly need to verify the users
    try {
      const{oldPassword,newPassword}=req.body;
  
      const user=await User.findById(req.user?._id);
  
     const passwordCorrect= await user.isPasswordCorrect(oldPassword);
     if(!passwordCorrect){
        throw new ApiError(400,"password is incorrecr");
        
     }
       user.password=newPassword;
       user.save({validationBeforeSave:false})
  
  
  return res.status(200).json(new ApiResponse(201,{user:user},"changed password successsfully"))

    } catch (error) {
      throw new ApiError(400,error?.message || "somethong went wrong")
    }


})



const changeAvatar=asynHandler(async(req,res)=>{

      try {
            console.log("jdu3");
            console.log(req.file);
            const avatarLocalPath=req.file?.path;

            if(!avatarLocalPath){
                  throw new ApiError(400,"image is not attached")
      
            }

            const avatarNewPath= await uploadOnCloudinary(avatarLocalPath);

            if(!avatarNewPath) {
                  throw new ApiError(400,"something went wrong with cloudinary");
            }

           console.log("pirin1");
           const user = await User.findByIdAndUpdate(req.user?._id,{ $set:{ avatar:avatarNewPath?.url } }, {new :true} );
           console.log(avatarNewPath);
      
            return res.status(200).json(new ApiResponse(201,{user:user},"done the change the avatar photos"))
      
      } catch (error) {
            throw new ApiError(401,"something is missing in the avatar image changing")
            
      }
})

const getCurrentUser=asynHandler(async(req,res)=>{

      return res.status(200).json(new ApiResponse(201,req.user,"user find inf successfully"))
})

const changeAccountDetails=asynHandler(async(req,res)=>{

      const {username,email}=req.body;

      if(!username || !email){throw new ApiError(400,"requored notj")}

      const user=await User.findByIdAndUpdate(req.user?._id,{$set:{username:username,email:email}},{new:true}).select("-password")

      return  res.status(200).json(new ApiResponse(201,user,"updated successfukky"))
})



const GetUserChannel = asynHandler(async(req,res)=>{

      const { username } = req.params;

      if(!username?.trim()){
            throw new ApiError(400,"username is required")
      }


     const channel= await User.aggregate([
            {
                  $match:{username:username?.toLowerCase()}
            },

            {
                  $lookup:{
                        from:"subscriptions",
                        localField:"_id",
                        foreignField:"channel",
                        as:"subscribers"

                  }
            },
            {
                  $lookup:{
                        from:"subscriptions",
                        localField:"_id", 
                       foreignField:"subscriber",
                        as:"subscribedTo"
                  }
            },
            {
                  $addField:{
                        subscriberCount:{
                              $size:"$subscribers"      
                        },
                        channelSubscribedToCount:{
                              $size:"$subscribedTo"
                              
                        },
                        IsSubscribed:{
                               $cond:{

                                    if:{
                                          $in:[req.user?._id,"$subscribers.subscriber"]

                                          
                                    
                                    ,then:true
                                    ,else:false
                                    
                              
                              }
                               }
                              
                        }
                  }
            },

            {
                  $project:{
                        fullname:1,
                        avatar:1,
                        subscriberCount:1,
                        channelSubscribedToCount:1,
                        IsSubscribed:1,
                        email:1,
                        coverImage:1




                  }
            }
      ])

    if(!channel?.length){
      throw new ApiError(400,"username not found")
    }
     

    return res.status(200).json(new ApiResponse(201,channel[0],"user find successfully"))





})

const getWatchHistory=asynHandler(async (req,res)=>{

try {
      console.log(1);
      
      // console.log(process.nextTick());
      console.log(2);
            const user = await User.aggregate(
                  [

                  {
                        $match:{
                              // no need to pass the objectid function as iin the req.user having the objectid function already it will give the error

                     _id: req.user?._id
                        }
      
                  },
                  {
                        $lookup:{
                              from:"videos",
                              localField:"watchHistory",
                              foreignField:"_id",
                              as:"watchHistory",
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
                                                                  avatar:1,
                                                                  fullname:1,
                                                                  email:1
                                                            }
                                                      }
                                                ]
                                          }
                                           
                                    },
                                    {
                                          $project:{
                                                owner:1,
                                                duration:1,
                                                title:1,
                                                thumbnail:1
                                          }
                                    },
                                    {
                                          $addFields:{
                                                owner:{
                                                      $first: "$owner"
                                                }
                                          }                            
                                    }
                              ]
                        }
                  }


                  // [
                  //       {
                  //         $match:
                  //           /**
                  //            * query: The query in MQL.
                  //            */
                  //           {
                  //             _id: req.user._id,
                  //           }
                  //       },
                  //       {
                  //         $lookup:
                  //           /**
                  //            * from: The target collection.
                  //            * localField: The local join field.
                  //            * foreignField: The target join field.
                  //            * as: The name for the results.
                  //            * pipeline: Optional pipeline to run on the foreign collection.
                  //            * let: Optional variables to use in the pipeline field stages.
                  //            */

                  //           {
                  //             from: "videos",
                  //             localField: "watchHistory",
                  //             foreignField: "_id",
                  //             as: "result",
                  //             pipeline: [
                  //               {
                  //                 $lookup: {
                  //                   from: "users",
                  //                   localField: "owner",
                  //                   foreignField: "_id",
                  //                   as: "boss",
                  //                   pipeline: [
                  //                     {
                  //                       $project: {
                  //                         username: 1,
                  //                         email: 1,
                  //                         fullname: 1,
                  //                       },
                  //                     },
                  //                   ],
                  //                 },
                  //               },
                  //               {
                  //                 $project: {
                  //                   duration: 1,
                  //                   videoFile: 1,
                  //                   thumbnail: 1,
                  //                   title: 1,
                  //                   boss: 1,
                  //                 },
                  //               },
                  //               {
                  //                 $addFields: {
                  //                   boss: {
                  //                     $first: "$boss",
                  //                   },
                  //                 },
                  //               },
                  //             ],
                  //           },
                  //       },
                      
                  //     ]
      
                ]);
      console.log(3);
            return res.status(200).json(new ApiResponse(200,user,"user historu is successfully finded"))
      
} 
catch (error) {
      throw new ApiError(400,"something went wrong");
      
}

})


 const addVideo=asynHandler(async(req,res)=>{

      try {
            console.log("jdu3");
            console.log(req.files);

            const videoLocalPath=req.files.video[0]?.path;
           const {Title} = req.body;

            if(!videoLocalPath){
                  throw new ApiError(400,"image is not attached")
      
            }
            const thumbnailLocal=req.files.thumbnail[0]?.path;
            if(!thumbnailLocal){
                  throw new ApiError(400,"image is not attached")
      
            }

            const videoNewPath= await uploadOnCloudinary(videoLocalPath);

              console.log(videoNewPath);

            const thumbnailNewPath= await uploadOnCloudinary(thumbnailLocal);

            console.log(thumbnailNewPath);

            if(!videoNewPath) {
                  throw new ApiError(400,"something went wrong with cloudinary");
            }
            if(!thumbnailNewPath) {
                  throw new ApiError(400,"something went wrong with cloudinary");
            }
            
           console.log("pirin1");
      //      const user = await User.findByIdAndUpdate(req.user?._id,{ $set:{ avatar:videoNewPath?.url } }, {new :true} );
      const video=await Video.create({
            videoFile:videoNewPath?.url,
            title:Title,
            thumbnail:thumbnailNewPath?.url,
            description:videoNewPath.original_filename,
            duration:videoNewPath.duration,
            owner:req.user._id
         
      })
           console.log(video);
      
            return res.status(200).json(new ApiResponse(201,video,"done the change the avatar photos"))
      
      } catch (error) {
            throw new ApiError(401,"something is missing in the avatar image changing")
            
      }



 })

 const addhistory=asynHandler(async(req,res)=>{
      try {
            console.log(1);
            const {video}=req.body;
            console.log(video);
            // const user=await User.findById(req.user._id);
            // user.watchHistory.push(new mongoose.Types.ObjectId('video'));
            // user.save({validationBeforeSave:'true'});
            // return ApiResponse(200,user,"some");
            console.log(2)
            const user=await User.findByIdAndUpdate(req.user._id,{$push:{watchHistory:new mongoose.Types.ObjectId(video)}},{new:true})
            console.log(3)
            return res.status(200).json(new ApiResponse(201,User,"history added successfuly"));

      } catch (error) {
            throw new ApiError(400,"something weent wrong");
            
      }
 })

export {registerUser,
      loginUser,
      loggedOut,
      refreshAccessToken,
      GetUserChannel,
      getWatchHistory,
      changeCurrentPassword,
      changeAvatar,
      getCurrentUser,
      changeAccountDetails,addVideo,addhistory} 