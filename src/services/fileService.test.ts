import fs from "fs";
import path from "path";
import { countFrameInMp3 } from "./fileService";
import { Mp3Error } from "../utils/typings/error";

describe("fileService", () => {
  test("counts frames from sample.mp3", () => {
    const filePath = path.join(__dirname, "..", "test-fixtures", "sample.mp3");
    const buffer = fs.readFileSync(filePath);

    expect(countFrameInMp3(buffer)).toBe(6090);
  });

  test("throws Mp3Error for invalid MP3 data", () => {
    expect(() => countFrameInMp3(Buffer.from([0, 0, 0, 0]))).toThrow(Mp3Error);
  });
});
