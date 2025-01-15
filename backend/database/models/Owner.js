import mongoose from 'mongoose';


export const ownerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  address: { 
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    match: /.+@.+\..+/ // Validation regex pour l'email
  },
  password: { type: String, required: true, minlength: 8 }, // Longueur minimale pour le mot de passe
  role:{type:String,},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});


export const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;
