import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { 
    country: {type: String, required: true },
    city: {type: String, required: true },
    street: {type: String, required: true },
  },
  logo: { type: String }, // Chemin local ou URL publique
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Restaurant= mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
