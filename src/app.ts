import express from "express";
import fileRoutes from "./routes/fileRoutes";

const app = express();

app.use(express.json());

app.use("/", fileRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "if you are seeing this, you are working" });
});

export default app;