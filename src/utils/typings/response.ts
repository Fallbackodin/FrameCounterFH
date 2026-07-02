import { Response } from "express";

export type FileUploadResponseBody = {
  frameCount?: number;
  error?: string;
};

export interface FileUploadResponse extends Response {
  json(body: FileUploadResponseBody): this;
  status(code: number): this;
}
