
const asynHandler = (requestHandler)=>{

     return (req,res,next)=>{
                Promise.resolve(requestHandler(req,res,next)).catch((error)=>{next(error)})
                           }
}


export {asynHandler}

/*

const Asynchandler= (fn)=>{ 
    
    return async(req,res,next)=>{
        try{  
            await fn(req,res,next)
         } 
        catch(error){
            res.status(400).json({success:false,message:error.message})
        } 
    } 
}


*/