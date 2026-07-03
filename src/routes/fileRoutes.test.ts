import request from "supertest";
import express from "express";
import fileRoutes from "./fileRoutes";

const app = express();
app.use(express.json());
app.use("/", fileRoutes);

describe("fileRoutes", () => {
  test("POST /file-upload returns 400 when missing file", async () => {
    const response = await request(app).post("/file-upload");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "No file uploaded" });
  });
});
