 

import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

//establishing tthe connection between the cloudinary server from the local server
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true
})


// now we are preparing the 
const uploadOnCloudinary = async (localFilePath)=>{
    try{
        console.log(process.version);
        console.log(process.env.CLOUDINARY_API_KEY);
        console.log(process.env.CLOUDINARY_CLOUD_NAME);
        console.log(process.env.CLOUDINARY_API_SECRET);

        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'})

        console.log("file is uploaded successfully",response.url);

        return response;

    }
    catch(error){
        fs.unlinkSync(localFilePath);
        console.log("error us here");
        return null;

    }


}


export {uploadOnCloudinary}