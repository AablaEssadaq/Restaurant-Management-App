import express from 'express'
import { addSupplier, deleteSupplier, editSupplier, getSuppliers } from '../controllers/supplierController.js'

export const suppliersRouter = express.Router()

suppliersRouter.post('/list/add', addSupplier)
suppliersRouter.post('/list', getSuppliers)
suppliersRouter.put('/list/update/:id', editSupplier)
suppliersRouter.delete('/list/delete/:id', deleteSupplier)