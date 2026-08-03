import { HttpException } from "./http.exception.js";

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request") {
    super(400, "BAD_REQUEST", message);
  }
}
