import { compare } from "bcrypt";
import mongoose from "mongoose";

export const authenticate = (req,res) => {

    const {email,password} = req.body;
    
}

export default authenticate;