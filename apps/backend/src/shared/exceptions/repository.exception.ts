import { BadRequestException } from "./bad-request.exception.js";
import { ConflictException } from "./conflict.exception.js";

export function mapDatabaseError(error: unknown, fallbackMessage = "Database operation failed.") {
    if (!error || typeof error !== "object") {
        throw new BadRequestException(fallbackMessage);
    }

    const message = "message" in error && typeof error.message === "string" ? error.message : "";
    const code = "code" in error && typeof error.code === "string" ? error.code : undefined;
    const detail = "detail" in error && typeof error.detail === "string" ? error.detail : undefined;

    if (code === "23505" || /unique|duplicate/i.test(message) || /unique|duplicate/i.test(detail ?? "")) {
        throw new ConflictException("A record with the same unique value already exists.");
    }

    if (code === "23503" || /foreign key|reference/i.test(message) || /foreign key|reference/i.test(detail ?? "")) {
        throw new BadRequestException("Referenced record does not exist.");
    }

    if (code === "22P02" || /invalid input syntax for type uuid|uuid/i.test(message)) {
        throw new BadRequestException("Invalid UUID provided.");
    }

    if (code === "23502" || /not null/i.test(message)) {
        throw new BadRequestException("Required field is missing.");
    }

    throw new BadRequestException(fallbackMessage);
}
