const jwt = require('jsonwebtoken')
const user = require('../models/user')

const auth = async(req,res,next) => {

    try{
        const token = jwt.verify(req.header('Authorization').replace('Bearer ',''), process.env.AUTH_STRING)
        const User = await user.findOne( { _id: token._id ,'tokens.token': req.header('Authorization').replace('Bearer ','')})
        if(!User){
            throw new Error()
        }
        req.token = req.header('Authorization').replace('Bearer ','')
        req.user = User
        next()
    } catch(e){
        res.status(401).send('Not authorized')
    }
}

 module.exports = auth   

    
    

