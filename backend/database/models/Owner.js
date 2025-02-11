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
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});


export const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;
