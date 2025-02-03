import Supplier from "../database/models/Supplier.js";

export const addSupplier = async(req,res) => {

try {
    const {firstName,lastName,phoneNumber,country,city,street,email,category,paymentMethod,rib,owner_id} = req.body;

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
    owners: [owner_id]
    }) 

    return res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });

} catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message});
}
}