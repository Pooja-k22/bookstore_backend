const jwt = require('jsonwebtoken')


const jwtMiddleware =(req,res,next)=>{

    const token = req.headers['authorization'].split(' ')[1]

    //console.log(token);

    try {
 
        const jwtResponse = jwt.verify(token ,'secretkey')
        console.log(jwtResponse);
        console.log(jwtResponse);
        
        req.payload = jwtResponse.userMail 
        next()
        
         
    } catch (error) {
        res.status(401).json('Invalid Token',error)
    }
    
    //console.log('inside jwt middleware');
     
}

module.exports = jwtMiddleware

