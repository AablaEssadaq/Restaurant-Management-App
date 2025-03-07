import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({

    name: {type:String,required: true,},
    subcategories: 
        [{name: {type:String, required:true},
          image:{type:String},
        }],
    image:{type:String,},
})

export const Category = mongoose.model('Logistics_categories', categoriesSchema);