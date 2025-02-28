import mongoose from 'mongoose';


export const EquipementSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, required: true, trim: true },
  quantity:{type:Number,required:true},
  damaged:{type:Number,required:true},
  brand: { type: String, trim: true },
});


export const Equipement = mongoose.model('Equipements', EquipementSchema);

export default Equipement;
