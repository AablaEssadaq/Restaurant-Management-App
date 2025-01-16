import express from 'express'
import authenticate from '../controllers/loginController.js';

export const loginRouter = express.Router()

loginRouter.post('/login', authenticate)

export default loginRouter;