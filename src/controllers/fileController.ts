import { countFrameInMp3 } from "../services/fileService";
import { FileUploadRequest } from "../utils/typings/request";
import { FileUploadResponse } from "../utils/typings/response";
import { Mp3Error } from "../utils/typings/error";

export const uploadFileMp3 = (req: FileUploadRequest, res: FileUploadResponse) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const frameCount = countFrameInMp3(file.buffer);

    return res.status(200).json({ frameCount });
  } catch (error: unknown) {
    const status = error instanceof Mp3Error ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "An error occurred while processing the file";

    return res.status(status).json({ error: message });
  }
};
