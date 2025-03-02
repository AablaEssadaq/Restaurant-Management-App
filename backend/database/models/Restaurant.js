import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { 
    country: {type: String, required: true },
    city: {type: String, required: true },
    street: {type: String, required: true },
  },
  logo: { type: String, default:"https://res.cloudinary.com/dregtu504/image/upload/v1738097413/Fork_and_knife_vlobbs.jpg" }, // Chemin local ou URL publique
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  equipements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipement" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Restaurant= mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
