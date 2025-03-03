import { hash } from "bcrypt";
import User from "../database/models/User.js";
import Manager from "../database/models/Manager.js";
import Restaurant from "../database/models/Restaurant.js";

export const addManager = async(req,res) => {
    try {
        const {firstName, lastName, phoneNumber, country, city, email, password, confirmPassword, owner_id, restaurant_id} = req.body;

        // Vérification des mots de passe
        if (password !== confirmPassword) {
          return res
            .status(400)
            .json({ message: "Les 2 mots de passe ne sont pas compatibles !" });
        }
    
        // Vérification de l'existence de l'utilisateur
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email déjà utilisé." });
        }

        // Hashage du mot de passe
        const hashedPassword = await hash(password, 10);
        
        // Création de l'utilisateur
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: "manager",
        });

        // Création de l'objet Owner
        const newManager = await Manager.create({
           firstName,
           lastName,
           phoneNumber,
            address: {
              country,
              city,
            },
           email,
           user_id: newUser._id,
           owner_id,
           restaurant_id,
        });

         // Réponse réussie
         res.status(201).json({ message: "Manager added successfully", manager: newManager });
    } catch (error) {
        res.status(500).json({message: "An error occurred", error: error.message});
    }
    
}

export const getManagers = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Récupérer les managers et peupler l'attribut user_id avec les champs souhaités
    const managers = await Manager.find({ restaurant_id: id }).populate('user_id', 'avatar created_at updated_at');

    return res.status(200).json({ 
      message: "Managers fetched successfully!", 
      managers 
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
}

export const deleteManager = async(req,res) => {
  try {
    const { id } = req.params;
    const manager = await Manager.findById(id);
    if (!manager) {
      return res.status(404).json({message:"Manager not found"})
    }

    await User.findByIdAndDelete(manager.user_id)

    await Manager.findByIdAndDelete(id);
    return res.status(200).json({ message: "Manager deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong.", error: error.message });

  }
}

export const editManager = async(req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, country, city, email } = req.body;
    
    const manager = await Manager.findById(id);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    
    const editedManager = await Manager.findByIdAndUpdate(
      id,
      { 
        firstName, 
        lastName, 
        phoneNumber, 
        'address.country': country, 
        'address.city': city, 
        email 
      },
      { new: true }
    );
        
    return res.status(200).json({ message: "Manager updated successfully!", manager: editedManager });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong.", error: error.message });
  } 
}

