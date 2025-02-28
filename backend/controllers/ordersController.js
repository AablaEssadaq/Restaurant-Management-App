import { Order } from "../database/models/Order.js";
import Owner from "../database/models/Owner.js";
import Supplier from "../database/models/Supplier.js";

export const createOrder = async (req, res) => {
    try {
        const { orderDate, shippingDate, status, supplier_id, products, owner_id } = req.body;

        // Vérifier si le propriétaire existe
        const owner = await Owner.findById(owner_id);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // Vérifier si le fournisseur existe
        const supplier = await Supplier.findById(supplier_id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        // Vérifier le format des produits
        if (!Array.isArray(products) || !products.every(p => p.product && p.quantity && p.price)) {
            return res.status(400).json({ message: "Invalid products format. Each product must have a name, quantity, and price." });
        }

        // Calculer le total
        const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Créer la commande
        const newOrder = await Order.create({
            orderDate,
            shippingDate,
            status,
            supplier: supplier._id,
            products,
            total
        });

        // Ajouter la commande au propriétaire
        owner.orders.push(newOrder._id);
        await owner.save();

        // Récupérer la méthode de paiement dynamiquement
        const orderWithPaymentMethod = await Order.findById(newOrder._id).populate('supplier', 'paymentMethod');

        return res.status(201).json({ message: "Order created successfully", order: orderWithPaymentMethod });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
      const { owner_id } = req.body;
  
      const owner = await Owner.findById(owner_id)
      .populate({
        path: "orders",
        populate: { path: "supplier" }, // Populate supplier inside each order
        options: { sort: { orderDate: -1, deliveryDate: 1  } } // Sort orders by orderDate in descending order
      });
    
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    
    return res.status(200).json({ orders: owner.orders });
    
  
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
  };
  

export const editOrder = async(req,res) => {
    try {
      const { id } = req.params;
      const { orderDate, shippingDate, status, supplier_id, products, owner_id } = req.body;
  
      const owner = await Owner.findById(owner_id);
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      
      const supplier = await Supplier.findById(supplier_id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      const order = await Order.findById(id)
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
       // Recalculate total
       const newTotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

       // Update order
       const editedOrder = await Order.findByIdAndUpdate(
        id,
        { orderDate, shippingDate, status, supplier: supplier._id, products, total: newTotal },
        { new: true }
      );

      return res.status(200).json({ message: "Order updated successfully !" , order: editedOrder});
    } 
    
    catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
  }

export const deleteOrder = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the order before deleting
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Remove the order from the owner's orders array
      await Owner.updateOne(
        { orders: id }, // Find the owner who has this order in the array
        { $pull: { orders: id } } // Remove the order from the array
      );
  
      // Delete the order
      await Order.findByIdAndDelete(id);
  
      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
  };
  