import express from 'express'
import { createOwnerAccount } from '../controllers/registerController.js'
import validateOwner from '../middlewares/validateOwner.js';
import multer from "../config/multer.js";

export const registerRouter = express.Router()

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Création de compte d'un propriétaire.
 *     description: Créer un nouveau compte pour un propriétaire (de restaurant), en saisissant ses informations personnelles, les informations du restaurant et ses identifiants de connexion.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - country
 *               - city
 *               - email
 *               - password
 *               - confirmPassword
 *               - restaurantName
 *               - restaurantCountry
 *               - restaurantCity
 *               - restaurantStreet
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               restaurantName:
 *                 type: string
 *               restaurantCountry:
 *                 type: string
 *               restaurantCity:
 *                 type: string
 *               restaurantStreet:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Validation error or email already taken
 *       500:
 *         description: Server error
 */

registerRouter.post('/register', multer.fields([
    { name: "avatar", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
   validateOwner,
   createOwnerAccount)

export default registerRouter;