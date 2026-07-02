import { countFrameInMp3 } from "../services/fileService";
import { FileUploadRequest } from "../utils/typings/request";
import { FileUploadResponse } from "../utils/typings/response";

export const uploadFileMp3 = (req: FileUploadRequest, res: FileUploadResponse) => {
  try {
    // YIMME: Check how to actually get the file from the request body
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const frameCount = countFrameInMp3(file.buffer);

    return res.status(200).json({ frameCount });
  }
  catch (error) {
    return res.status(500).json({ error: "An error occurred while processing the file" });
  }
}