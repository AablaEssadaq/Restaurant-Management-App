import { hash } from 'bcrypt';
import Owner from '../database/models/Owner.js';
import restaurantModel from '../database/models/Restaurant.js';

export const createOwner = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, country, city, email, password, confirmPassword } = req.body;
    const {restaurantName, restaurantCountry, restaurantCity, restaurantStreet} = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "les 2 mots de passes de sont pas compatibles !" });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Email déja utilisé." });
    }

    const hashedPassword = await hash(password, 10);

   
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
      password: hashedPassword,
      role:"Owner",
    });

    const newRestaurant = await restaurantModel.create({
        name:restaurantName,
        address: { 
            country: restaurantCountry,
            city: restaurantCity,
            street: restaurantStreet,
          },
          owner_id: newOwner._id
    });


    res.status(201).json({
      message: "Owner created successfully",
      owner: newOwner,
      restaurant:newRestaurant
    });
  


} catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }

 


};

export default createOwner;
