import express from 'express'
import { createOwnerAccount } from '../controllers/registerController.js'
import validateOwner from '../middlewares/validateOwner.js';

export const registerRouter = express.Router()

registerRouter.post('/register', validateOwner , createOwnerAccount)

export default registerRouter;