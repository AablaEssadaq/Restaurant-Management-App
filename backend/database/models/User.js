import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        match: /.+@.+\..+/ // Validation regex pour l'email
      },
      password: { type: String, required: true, minlength: 8 }, // Longueur minimale pour le mot de passe
      role:{type:String, required: true, enum: ['owner', 'manager'], default: 'owner'},
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
})

export const User = mongoose.model('User', userSchema);

export default User;