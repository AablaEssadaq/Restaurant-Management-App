import express from 'express'
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectDb } from './database/connect.js';
import registerRouter from './routes/register.js';
import authRouter from './routes/auth.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import refreshTokenRouter from './routes/refreshToken.js';
import { suppliersRouter } from './routes/suppliers.js';
import { ordersRouter } from './routes/orders.js';
dotenv.config();

const app = express()
const port = process.env.PORT || 8081;

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // ✅ Allow only your frontend
  credentials: true,               // ✅ Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allow necessary methods
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow necessary headers
}));
app.use('/api',[registerRouter,refreshTokenRouter])
app.use('/api/auth',authRouter)
app.use('/api/suppliers',[suppliersRouter,ordersRouter])


// Définir la configuration de Swagger
const options = {
    definition: {
      openapi: '3.0.0', // Version de l'OpenAPI
      info: {
        title: 'Restaurant Management App API', // Nom de l'API
        version: '1.0.0', // Version de l'API
        description: 'Documentation de l\'API pour une application web de gestion de restaurant', // Description
      },
      servers: [
        {
          url: `http://localhost:${port}`, // URL de l'API
        },
      ],
    },
    apis: ['./routes/*.js'], // Chemin vers les fichiers contenant les annotations Swagger
  };
  
  // Générer la documentation Swagger à partir des commentaires dans le code
  const specs = swaggerJsdoc(options);
  
  // Utiliser swagger-ui-express pour afficher la documentation à l'URL /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
const start = async() => {
    try {
        await connectDb();
        app.listen(port, () => {console.log(`Server listening at port ${port} ...`)} )
    } catch (error) {
        console.error("Couldn't start the server: ", error.message);
        process.exit(1);
    }
    
}

start()