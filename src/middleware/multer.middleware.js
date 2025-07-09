import multer from 'multer'

// for the destinattion we define the folder name that is present in the root directory 
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public")
    },
    filename:function(req,file,cb){

        cb(null,file.originalname)
    }
})


 export const upload=multer({storage:storage})