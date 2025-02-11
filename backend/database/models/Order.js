import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderDate: {type:Date,default: Date.now,required: true,},
    shippingDate: {type:Date,required: true,},
    status: {type:String, enum: ['En cours', 'Livrée', 'Annulée'], default: 'en cours' },
    supplier: {type:mongoose.Schema.Types.ObjectId,ref: 'Supplier', required: true },
    products: 
        [{product: {type:String, required:true},
          quantity: {type:Number, required:true},
          price: {type:Number, required:true},
        }],
    total:{type:Number,},
})

export const Order = mongoose.model('Order', orderSchema);