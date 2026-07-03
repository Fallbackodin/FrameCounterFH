export class Mp3Error extends Error {
  public status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "Mp3Error";
    this.status = status;
  }
}
