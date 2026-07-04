import express from "express";
import fileRoutes from "./routes/fileRoutes";

const app = express();

app.use(express.json());

app.use("/", fileRoutes);

export default app;
