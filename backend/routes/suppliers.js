import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { addSupplier, getSuppliers } from '../controllers/supplierController.js'

export const suppliersRouter = express.Router()

suppliersRouter.post('/list/add', addSupplier)
suppliersRouter.post('/list', getSuppliers)