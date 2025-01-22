import express from 'express'
import { refreshAccessToken } from '../controllers/refreshTokenController.js';

export const refreshTokenRouter = express.Router();

refreshTokenRouter.post('/refresh-token', refreshAccessToken);

export default refreshTokenRouter;