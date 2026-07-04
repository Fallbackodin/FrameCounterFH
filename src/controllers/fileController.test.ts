import { uploadFileMp3 } from "./fileController";
import { FileUploadRequest } from "../utils/typings/request";
import { FileUploadResponse, FileUploadResponseBody } from "../utils/typings/response";

describe("fileController", () => {
  test("responds 400 when no file is uploaded", () => {
    const statusMock = jest.fn();
    const jsonMock = jest.fn();

    const res = {
      status(code: number) {
        statusMock(code);
        return res;
      },
      json(body: FileUploadResponseBody) {
        jsonMock(body);
        return res;
      },
    } as FileUploadResponse;

    const req = { file: undefined } as FileUploadRequest;

    uploadFileMp3(req, res);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: "No file uploaded" });
  });
});
