import express from 'express'
import  { authenticateUser, logoutUser } from '../controllers/authController.js';
import validateUser from '../middlewares/validateUser.js';
import verifyToken from '../middlewares/verifyToken.js';

export const authRouter = express.Router()


/**
 * @swagger
 * /auth/login:
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
authRouter.post('/login', validateUser, authenticateUser)


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnecter un utilisateur
 *     description: Déconnecter un utilisateur et supprimer son refresh token de la base de données à partir de son email extrait du token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Failed to log out.
 */
authRouter.post('/logout', verifyToken, logoutUser)

export default authRouter;