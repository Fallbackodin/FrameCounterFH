import { Router } from "express";
import multer from "multer";
import { uploadFileMp3 } from "../controllers/fileController";

const router = Router();

// YIMME: Check if it is fine to user multer to easily get the buffer of raw bytes
// if not then I need to do this manually
const upload = multer({
  storage: multer.memoryStorage(),
})

console.log("upload: ", upload);

// YIMME: Check if this should be a POST or GET API
// router.post("/file-upload", upload.single("file"), uploadFileMp3);
router.post("/file-upload", upload.single("file"), uploadFileMp3);

export default router;