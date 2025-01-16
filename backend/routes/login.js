import express from 'express'
import authenticateUser from '../controllers/loginController.js';
import validateUser from '../middlewares/validateUser.js';

export const loginRouter = express.Router()


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     description: Connecter un utilisateur et renvoyer des access et refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
loginRouter.post('/login', validateUser, authenticateUser)

export default loginRouter;