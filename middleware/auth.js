const dotenv = require('dotenv')
dotenv.config()
const jwt = require('jsonwebtoken')

module.exports =  (req, res, next) => {
    let token

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return res.status(401).json({error:'token missing'})
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.user = decoded
        next()
    } catch (exception) {
        res.status(400).json({error:'invalid token'})
    }
}

