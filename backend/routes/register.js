import express from 'express'
import createOwner from '../controllers/registerController.js'
import validateOwner from '../middlewares/validateOwner.js';

export const registerRouter = express.Router()

registerRouter.post('/register', validateOwner , createOwner)

export default registerRouter;