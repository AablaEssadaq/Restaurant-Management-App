import express from 'express'
import { createOrder, deleteOrder, editOrder, getOrders } from '../controllers/ordersController.js'
import verifyToken from '../middlewares/verifyToken.js'

export const ordersRouter = express.Router()

ordersRouter.post('/orders/add',verifyToken, createOrder)
ordersRouter.post('/orders',verifyToken, getOrders)
ordersRouter.put('/orders/update/:id',verifyToken, editOrder)
ordersRouter.delete('/orders/delete/:id',verifyToken, deleteOrder)
