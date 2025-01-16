import { hash } from 'bcrypt';
import Owner from '../database/models/Owner.js';
import Restaurant from '../database/models/Restaurant.js';
import User from '../database/models/User.js';

export const createOwnerAccount = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, country, city, email, password, confirmPassword } = req.body;
    const {restaurantName, restaurantCountry, restaurantCity, restaurantStreet} = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "les 2 mots de passes de sont pas compatibles !" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déja utilisé." });
    }

    const hashedPassword = await hash(password, 10);

   
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role:"owner",
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

    const newRestaurant = await Restaurant.create({
        name:restaurantName,
        address: { 
            country: restaurantCountry,
            city: restaurantCity,
            street: restaurantStreet,
          },
          owner_id: newOwner._id
    });


    res.status(201).json({
      message: "Account created successfully",
      user: newUser,
      owner: newOwner,
      restaurant:newRestaurant
    });
  


} catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }

 


};

export default createOwnerAccount;
