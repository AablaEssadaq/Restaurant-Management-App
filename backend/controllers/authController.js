import { compare } from "bcrypt";
import User from "../database/models/User.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
        const decoded = jwt.decode(refreshToken);
        const tokenExpirationDate = new Date(decoded.exp * 1000); // Convert `exp` to milliseconds
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await User.findByIdAndUpdate(foundUser._id, {
            refreshToken: hashedRefreshToken,
            refreshTokenExpiresAt: tokenExpirationDate,
          });

        //Store the unhashed refresh Token in the http-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,         // Prevents access via JavaScript
           // secure: true,           // Ensures it's sent over HTTPS
            sameSite: "strict",     // Prevents CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });

        return res.status(200).json({message: "Authenticated successfully !", accessToken,refreshToken})

    } catch (error) {
        return res.status(500).json({message : "Something went wrong !", error : error.message})
    }
    
}

export const logoutUser = async (req, res) => {
    try {
      // Clear the refresh token from the database
      console.log(req.email)

      await User.findOneAndUpdate( {email :req.email} , {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      });
  
      // Clear the cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
       // secure: true,
        sameSite: "strict",
      });
  
      return res.status(200).json({ message: "Logged out successfully." });

    } catch (error) {
      return res.status(500).json({ message: "Failed to log out.", error : error.message });
    }
  };
  

