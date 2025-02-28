import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { getCategories, getItems } from '../controllers/logisticsController.js'

export const logisticsRouter = express.Router()

logisticsRouter.get('/',verifyToken, getCategories)
logisticsRouter.post('/items',verifyToken, getItems)