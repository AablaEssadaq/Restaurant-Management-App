import { Category } from "../database/models/LogisticsCategories.js";

export const getCategories = async(req,res) => {
    try {
        const categories = await Category.find().populate('subcategories');
        return res.status(200).json({message:"Categories fetched successfully", categories})
        
    } catch (error) {
        return res.status(500).json({msg:"An error occured", error : error.message})
    }
}