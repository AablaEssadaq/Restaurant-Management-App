import mongoose from 'mongoose';


export const supplierSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  address: { 
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    match: /.+@.+\..+/ // Validation regex pour l'email
  },
  category:{ type: String, required: true },
  paymentMethod:{type:String},
  rib: {type:String},
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Owner" }] // 🔗 Relation avec les propriétaires
});


export const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
