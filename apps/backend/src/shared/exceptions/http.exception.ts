import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HttpException extends Error {
  constructor(
    public readonly statusCode: ContentfulStatusCode,
    public readonly code: string,
    message: string,
  ) {
    super(message);

    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
