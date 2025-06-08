import express from "express";
import cors from "cors";

export function startExpress() {
  const app = express();
  app.use(cors(), express.json());
  return app;
}
