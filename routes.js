// import the express
const express = require('express')

// import userController
const userController = require('./controllers/userController')

// import bookcontroller
const bookController = require('./controllers/bookController')

// 
const jobCrontroller = require('./controllers/jobCrontroller')

// app controller
const appController =require('./controllers/appController')
//  impot jwtmiddleware
const jwtMiddleware = require('./middleware/jwtMiddleware')

// import multer config
const multerConfig = require('./middleware/ImgmulterMiddleware')
const pdfmulterConfig = require('./middleware/pdfmulterMiddleware')

// instance
const route = new express.Router()
// -----------------------------------------------------------
 
// path for register
 route.post('/register', userController.registerController)

//  path for login
route.post('/login',userController.loginController)

// path for google login
route.post('/google-login',userController.googleLoginController)

// path to get home books
route.get('/all-home-book',bookController.getHomeBookController) 


// to get all jobs
route.get('/all-jobs',jobCrontroller.getAllJobController)

// ------------------------------------------------------------------USER--------------------------------------------------------------------------
                                                         
// path to add books
route.post('/add-book',jwtMiddleware, multerConfig.array('uploadedImages',3) ,bookController.addBookController)

// get all books to display
route.get('/all-books',jwtMiddleware,bookController.getAllBookController)

// get view book details
route.get('/view-book/:id',bookController.getABookController)

// path to appay for job
route.post('/apply-job',jwtMiddleware,pdfmulterConfig.single('resume'),appController.addApplicationController)

// edit user profile
route.put('/user-profile-update',jwtMiddleware,multerConfig.single('profile'),userController.editUserProfileController)


// path to get all user added book
route.get('/user-books', jwtMiddleware,bookController.getAllUserBookController)

// path to get all user brought book
route.get('/user-brought-books', jwtMiddleware,bookController.getAllUserBroughtBookController)

// delete book
route.delete("/delete-user-books/:id", bookController.deleteAUserBookController)


// make payment 
route.put('/make-payment',jwtMiddleware,bookController.makePaymentController)

// -----------------------------------------------------------Admin-----------------------------

// path to get all book admin
route.get('/admin-all-books',jwtMiddleware,bookController.getAllBookAdminController)

route.put('/approve-book' ,jwtMiddleware,bookController.approveBookController)

// get all users
route.get('/all-users',jwtMiddleware,userController.getAllUsersController)

// add new job
route.post('/add-job',jobCrontroller.addJobController)

// path to delete a job
route.delete('/delete-job/:id',jobCrontroller.deleteAJobController)

// get all application
route.get('/all-application',appController.getAllapplicationController)


// path to update admin profile
route.put('/admin-profile-update',jwtMiddleware,multerConfig.single('profile'),userController.editAdminProfileController)





// -----------------------------------------------------------------------export--------------------------------------------------------------------

// routes export
module.exports = route

