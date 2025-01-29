import { hash } from "bcrypt";
import Owner from "../database/models/Owner.js";
import Restaurant from "../database/models/Restaurant.js";
import User from "../database/models/User.js";
import cloudinary from "../config/cloudinary.js";

export const createOwnerAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      country,
      city,
      email,
      password,
      confirmPassword,
      restaurantName,
      restaurantCountry,
      restaurantCity,
      restaurantStreet,
    } = req.body;

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

    // Récupération des fichiers avatar et logo (Multer)
    const avatarFile = req.files?.avatar?.[0]?.path || null;
    const logoFile = req.files?.logo?.[0]?.path || null;

    // Upload des fichiers sur Cloudinary
    const avatarUpload = avatarFile
      ? await cloudinary.uploader.upload(avatarFile, { folder: "avatars" })
      : null;

    const logoUpload = logoFile
      ? await cloudinary.uploader.upload(logoFile, { folder: "restaurant_logos" })
      : null;

    // Hashage du mot de passe
    const hashedPassword = await hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "owner",
      avatar: avatarUpload?.secure_url || null,
    });

    // Création de l'objet Owner
    const newOwner = await Owner.create({
      firstName,
      lastName,
      phoneNumber,
      address: {
        country,
        city,
      },
      email,
      user_id: newUser._id,
    });

    // Création du restaurant
    const newRestaurant = await Restaurant.create({
      name: restaurantName,
      logo: logoUpload?.secure_url || null,
      address: {
        country: restaurantCountry,
        city: restaurantCity,
        street: restaurantStreet,
      },
      owner_id: newOwner._id,
    });

    // Réponse réussie
    res.status(201).json({
      message: "Account created successfully",
      user: newUser,
      owner: newOwner,
      restaurant: newRestaurant,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

export default createOwnerAccount;
