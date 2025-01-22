import express from 'express'
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectDb } from './database/connect.js';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express()
const port = process.env.PORT || 8081;

app.use(express.json())
app.use(cors())
app.use(cookieParser());
app.use('/api',[registerRouter,loginRouter])


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