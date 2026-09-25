import express from "express";
import cors from "cors";

import clientRoutes from "./routes/client.routes.js";
import grindingRoutes from "./routes/grinding.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://chakki-business-frontend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman, server-to-server requests etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chakki Business Backend API is running",
  });
});

app.use("/api/clients", clientRoutes);
app.use("/api/grinding-records", grindingRoutes);

export default app;