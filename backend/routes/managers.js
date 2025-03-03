import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { addManager, deleteManager, editManager, getManagers } from '../controllers/managersController.js'

export const managersRouter = express.Router()

managersRouter.post('/managers/add', verifyToken, addManager)
managersRouter.get('/managers/:id', verifyToken, getManagers)
managersRouter.delete('/managers/delete/:id', verifyToken, deleteManager)
managersRouter.put('/managers/update/:id', verifyToken, editManager)