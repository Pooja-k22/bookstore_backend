// import dotenv library
require('dotenv').config() //load environment

//import express library
const express = require('express')

// import cors library
const cors = require('cors')

// import route
const route = require('./routes')

// import db connection
require('./dbconnection')

// create the server -express()
const bookstoreServer = express()

// server using cors
bookstoreServer.use(cors())
//return middleware for parse the data  - middleware which break the request response cycle
bookstoreServer.use(express.json())
// use routes
bookstoreServer.use(route)
// exports uploaded folder from server 
bookstoreServer.use('/upload', express.static('./uploads'))
// exports uploaded file folder from server
bookstoreServer.use('/pdfupload', express.static('./pdfUploads'))


// create port
PORT = 4000 || process.env.PORT

// port listen
bookstoreServer.listen(PORT , ()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})

