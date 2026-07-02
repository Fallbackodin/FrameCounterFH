import { Router } from "express";
import multer from "multer";
import { uploadFileMp3 } from "../controllers/fileController";

const router = Router();

// Use multer to handle getting the file easily from the request objec 
const upload = multer({
  storage: multer.memoryStorage(),
})

// YIMME: Check if this should be a POST or GET API
// router.post("/file-upload", upload.single("file"), uploadFileMp3);
router.post("/file-upload", upload.single("file"), uploadFileMp3);

export default router;