import express from 'express'
import { addSupplier, deleteSupplier, editSupplier, getSuppliers } from '../controllers/supplierController.js'
import verifyToken from '../middlewares/verifyToken.js'

export const suppliersRouter = express.Router()

suppliersRouter.post('/list/add', verifyToken, addSupplier)
suppliersRouter.post('/list', verifyToken, getSuppliers)
suppliersRouter.put('/list/update/:id',verifyToken, editSupplier)
suppliersRouter.delete('/list/delete/:id', verifyToken, deleteSupplier)