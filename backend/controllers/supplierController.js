import Owner from "../database/models/Owner.js";
import Supplier from "../database/models/Supplier.js";

export const addSupplier = async(req,res) => {

try {
    const {firstName,lastName,phoneNumber,country,city,street,email,category,paymentMethod,rib,owner_id} = req.body;

    // Vérifier si le propriétaire existe
    const owner = await Owner.findById(owner_id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const newSupplier = await Supplier.create({
    firstName,
    lastName,
    phoneNumber,
    address: {
      country,
      city,
      street,
    },
    email,
    category,
    paymentMethod,
    rib,
    }) 

    owner.suppliers.push(newSupplier._id);
    await owner.save();

    return res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });

} catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message});
}
}

export const getSuppliers = async(req,res) => {

 try {
    const { owner_id } = req.body;

    const owner = await Owner.findById(owner_id).populate("suppliers");
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    return res.status(200).json({ suppliers: owner.suppliers });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong.", error: error.message });
  }

}