import express from "express";
import cors from "cors";

export function startExpress() {
  const app = express();
  
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };

  app.use(cors(corsOptions), express.json());
  return app;
}
