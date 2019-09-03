const multer = require("multer")

module.exports = multer({
    storage: multer.diskStorage({}),
    limits: { fileSize: 8000000 },
    fileFilter: (req,file,callback)=>{
    
        if(!file.mimetype.match(/jpg|jpeg|png|gif|svg$i/))
        {
            callback(Error,false)
            return
        }
      
        callback(null,true)
    }
})
