import Equipement from "../database/models/Equipements.js";
import { Category } from "../database/models/LogisticsCategories.js";

export const getCategories = async(req,res) => {
    try {
        const categories = await Category.find().populate('subcategories');
        return res.status(200).json({message:"Categories fetched successfully", categories})
        
    } catch (error) {
        return res.status(500).json({msg:"An error occured", error : error.message})
    }
}

export const getItems = async(req,res) => {
    const {subcategoryName} = req.body;
    try {
        const items = await Equipement.find({subcategory: subcategoryName});
        return res.status(200).json({message:"Items fetched successfully", items})
    } catch (error) {
        return res.status(500).json({msg:"An error occured", error : error.message})
    }
}

export const deleteItems = async(req,res) => {
    try {
      const {id} = req.params;
        
    } catch (error) {
        
    }
}