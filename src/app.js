import express from "express";
import cors from "cors";

import clientRoutes from "./routes/client.routes.js";
import grindingRoutes from "./routes/grinding.routes.js";

const app = express();

app.use(
  cors({
    origin: true,
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