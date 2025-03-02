import Equipement from "../database/models/Equipements.js";
import { Category } from "../database/models/LogisticsCategories.js";
import Restaurant from "../database/models/Restaurant.js";

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

export const addItem = async(req,res) => {
    try {
        const { name, categoryId, subcategory, quantity, damaged, brand, restaurantId } = req.body

        const restaurant = await Restaurant.findById(restaurantId)
        if (!restaurant) {
            return res.status(404).json({message: "Restaurant not found "})

        }
        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(404).json({message: "No such category found"})
        }
        const item = await Equipement.create({ name, categoryId, subcategory, quantity, damaged, brand})
        
        // Ajouter l'équipement au restaurant
        restaurant.equipements.push(item._id);
        await restaurant.save();

        return res.status(201).json({ message: "Equipement added successfully", equipement: item });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong.", error: error.message });

    }
}

export const deleteItems = async(req,res) => {
    try {
      const {id} = req.params;
      const item = await Equipement.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Equipement not found" });
      }
      // Remove equipement from the restaurant
      await Restaurant.updateOne({ equipements: id }, { $pull: { equipements: id } });
      
      // Delete the equipement
      await Equipement.findByIdAndDelete(id);

      return res.status(200).json({ message: "Equipement deleted successfully" });
        
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message });

    }
}

export const repairItem = async(req,res) => {
    try {
        const {id,fixed} = req.body;
        const item = await Equipement.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Equipement not found" });
        }
        // Vérifier si 'fixed' est un nombre valide
        if (!fixed || fixed <= 0) {
            return res.status(400).json({ message: "Le nombre d'équipements réparés doit être supérieur à zéro" });
        }
         // S'assurer que 'fixed' ne dépasse pas 'damaged'
         if (fixed > item.damaged) {
            return res.status(400).json({ message: `Vous ne pouvez pas réparer plus de ${item.damaged} équipements` });
        }
        // Mettre à jour le nombre d'équipements endommagés
        item.damaged -= fixed;
        await item.save();

        return res.status(200).json({ message: "Equipement repaired successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong.", error: error.message });

    }
}

export const editItem = async(req,res) => {
    try {
        const { id } = req.params;
        const { name, quantity, damaged, brand, restaurantId } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }


        const item = await Equipement.findById(id)
            if (!item) {
            return res.status(404).json({ message: "Equipement not found" });
        }
          
        // Update equipement
        const newItem = await Equipement.findByIdAndUpdate(
        id,
        { name, quantity, damaged, brand },
        { new: true }
        );
        
        return res.status(200).json({ message: "Equipement updated successfully !", item: newItem});
              

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong.", error: error.message });

    }
}