import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export function verifyToken(req,res,next) {
    const authHeader = req.headers['authorization']  //get the authorization header from the request
    const token = authHeader && authHeader.split(' ')[1]  //get the token from the header
    if (token == null) return res.status(401).json({message:"Unauthorized"})
    jwt.verify(token,process.env.ACCESS_TOKEN_KEY,(err,user)=>{    //verify if the token is valid by verifying the signature with they secret key. The callback returns the error if the validation is not successful, and the token payload if it's successful
      if (err) return res.status(403).json({message:"Forbidden"})
      const {role, ...userDetails} = user    
      req.user = userDetails;
      req.role = role;
    next()
    })
}

export default verifyToken;