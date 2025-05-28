// impoer multer
const multer = require('multer')


const storage =multer.diskStorage({

    // path to store the file
    destination:(req,file,callback)=>{
        callback(null,'./uploads')
    },

    // name to store the file
    filename:(req,file,callback)=>{
        const fname =`image-${file.originalname}`
        callback(null,fname)

    }
})

const fileFilter=(req,file,callback)=>{
    // true for uploading
    if(file.mimetype =='image/png' || file.mimetype =='image/jpg' || file.mimetype =='image/jpeg' ){
        callback(null, true)  
    }

    // false for skipping
    else{
        callback(null, false)
        return callback( new Error('accept only png , jpg , jpeg files'))
    }
}

// create multer config
const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig