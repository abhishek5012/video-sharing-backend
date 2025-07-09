import dotenv from 'dotenv'
// import 'dotenv/config';
dotenv.config({path:'./.env'})
 


import DataBaseConnect  from './db/index.js'

import { app } from "./app.js"


DataBaseConnect().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is listening on port",process.env.PORT);
    });

}).catch((err)=>{
    console.log("error in connecting the database",err);
})


app.get('/',(req,res)=>{ 
    console.log("yes we are in");
    res.json({message:"it id ok."})
})

 