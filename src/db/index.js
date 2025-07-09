import mongoose from 'mongoose'
import {DB_NAME} from "../constant.js"

  const  DataBaseConnect = async()=> {
    try{
       console.log("lo0");
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log("lo9");
        console.log("we have connected successfully");
        // here we need to listen the event for the connecting to the database
        
        console.log(ConnectionInstance.connection.host);
        console.log(ConnectionInstance.connection.name);
        
        return ConnectionInstance;

    }

    catch(error){
        console.log("ERROR faced in connecting to the database")
        // when the error face terminate the server as it is a good practice
        process.exit(1)
    }
    
 }


 export  default  DataBaseConnect