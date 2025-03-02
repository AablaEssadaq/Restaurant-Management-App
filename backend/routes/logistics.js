import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { addItem, deleteItems, editItem, getCategories, getItems, repairItem } from '../controllers/logisticsController.js'

export const logisticsRouter = express.Router()

logisticsRouter.get('/',verifyToken, getCategories)
logisticsRouter.post('/items',verifyToken, getItems)
logisticsRouter.post('/items/add',verifyToken, addItem)
logisticsRouter.post('/items/repair',verifyToken, repairItem)
logisticsRouter.put('/items/update/:id',verifyToken, editItem)
logisticsRouter.delete('/items/delete/:id',verifyToken, deleteItems)