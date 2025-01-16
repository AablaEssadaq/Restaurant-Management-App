import { compare } from "bcrypt";
import User from "../database/models/User.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const authenticateUser = async(req,res) => {

    const {email,password} = req.body;

    try {
        const foundUser = await User.findOne({email})

        if(!foundUser){
            return res.status(404).json({message : "No user found."})
        }
        const validPassword = await compare(password,foundUser.password);

        if(!validPassword){
            return res.status(401).json({message : "Invalid password."})
        }
    
        const accessToken = jwt.sign({email: foundUser.email, role: foundUser.role},process.env.ACCESS_TOKEN_KEY,{expiresIn:'15m'})
        const refreshToken = jwt.sign({email: foundUser.email, role: foundUser.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:'30d'}) 

        return res.status(200).json({message: "Authenticated successfully !", accessToken, refreshToken})

    } catch (error) {
        return res.status(500).json({message : "Something went wrong !",
                              error : error.message
        })
    }
    
}

export default authenticateUser;