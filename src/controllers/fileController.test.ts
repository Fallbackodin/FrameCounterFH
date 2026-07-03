import { uploadFileMp3 } from "./fileController";

describe("fileController", () => {
  test("responds 400 when no file is uploaded", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    uploadFileMp3({ file: undefined } as any, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
  });
});
