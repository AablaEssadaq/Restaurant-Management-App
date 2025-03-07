import { compare } from "bcrypt";
import User from "../database/models/User.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Owner from "../database/models/Owner.js";
import Restaurant from "../database/models/Restaurant.js";
import cloudinary from "../config/cloudinary.js";

dotenv.config()

export const authenticateUser = async(req,res) => {

    const {email,password} = req.body;

    let authUser={}
    let restaurant={}

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

        if(foundUser.role==="owner"){
          authUser = await Owner.findOne({email})
          authUser = { ...authUser.toObject(), avatar: foundUser.avatar };
          restaurant = await Restaurant.findOne({owner_id: authUser._id})
        }
        
        await User.findByIdAndUpdate(foundUser._id, {
            refreshToken: hashedRefreshToken,
            refreshTokenExpiresAt: tokenExpirationDate,
          });

          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,  // False for local development
            sameSite: "Lax", // Because the frontend and backend are on different domains
          });
          

        //Store the unhashed refresh Token in the http-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,         // Prevents access via JavaScript
            secure: false,           // Switch to true in production
            sameSite: "Lax",     
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });

        return res.status(200).json({message: "Authenticated successfully !", accessToken,refreshToken,authUser,restaurant})

    } catch (error) {
        return res.status(500).json({message : "Something went wrong !", error : error.message})
    }
    
}

export const logoutUser = async (req, res) => {
    try {

     // Get the access token from cookies
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res.status(400).json({ message: 'No access token provided' });
    }

    // Decode the token to get the email
    // Note: We don't need to verify the token here since we're just logging out
    const decoded = jwt.decode(accessToken);
    
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: 'Invalid token format' });
    }


      await User.findOneAndUpdate( {email :decoded.email} , {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      });
  
      // Clear the accessToken cookie
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      });

      // Clear the refreshToken cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      });
  
      return res.status(200).json({ message: "Logged out successfully." });

    } catch (error) {
      return res.status(500).json({ message: "Failed to log out.", error : error.message });
    }
};

export const editOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { lastName, firstName, phoneNumber, email, country, city } = req.body;
    
    console.log(id, lastName, firstName);

    const owner = await Owner.findById(id)

    const existingUser = await User.findById(owner.user_id)
    
    // Récupération des fichiers avatar et logo (Multer)
    const avatarFile = req.files?.avatar?.[0]?.path || null;
    
    // Upload des fichiers sur Cloudinary
    const avatarUpload = avatarFile
      ? await cloudinary.uploader.upload(avatarFile, { folder: "avatars" })
      : null;
    
    // Modification du compte du propriétaire
    const newUser = await User.findOneAndUpdate(
      { _id: owner.user_id }, // Filter object
      { 
        email,
        avatar: avatarUpload?.secure_url || existingUser.avatar, // Keep existing avatar if no new upload
      },
      { new: true }
    );
    
    // Modification du propriétaire
    const newOwner = await Owner.findByIdAndUpdate(
      id,
      { lastName, firstName, phoneNumber, email, 'address.country':country, 'address.city':city },
      { new: true }
    );
    
    return res.status(200).json({ 
      message: "Profile updated successfully!", 
      user: newUser, 
      owner: newOwner 
    });
    
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to update profile.", 
      error: error.message 
    });
  }
}
  
export const editRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurantName, restaurantCountry, restaurantCity, restaurantStreet } = req.body;

    const oldRestaurant = await Restaurant.findById(id);

    // Récupération du fichier logo (Multer)
    const logoFile = req.files?.logo?.[0]?.path || null;
    
    // Upload du fichier sur Cloudinary
    const logoUpload = logoFile
      ? await cloudinary.uploader.upload(logoFile, { folder: "restaurant_logos" })
      : null;
    
    // Modification du restaurant
    const newRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id}, // Filter object
      { 
        name: restaurantName,
        'address.country': restaurantCountry,
        'address.city': restaurantCity,
        'address.street': restaurantStreet,
        logo: logoUpload?.secure_url || oldRestaurant.logo, // Keep existing logo if no new upload
      },
      { new: true }
    );

    return res.status(200).json({ 
      message: "Restaurant updated successfully!", 
      restaurant: newRestaurant
    });

  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to update restaurant.", 
      error: error.message 
    });
  }
};
