import mongoose from 'mongoose';


export const managerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  address: { 
    country: { type: String, },
    city: { type: String, },
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    match: /.+@.+\..+/ // Validation regex pour l'email
  },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  
});

export const Manager = mongoose.model('Manager', managerSchema);

export default Manager;

