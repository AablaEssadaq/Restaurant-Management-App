import express from 'express'
import { createOrder, deleteOrder, editOrder, getOrders } from '../controllers/ordersController.js'

export const ordersRouter = express.Router()

ordersRouter.post('/orders/add', createOrder)
ordersRouter.post('/orders', getOrders)
ordersRouter.put('/orders/update/:id', editOrder)
ordersRouter.delete('/orders/delete/:id', deleteOrder)
