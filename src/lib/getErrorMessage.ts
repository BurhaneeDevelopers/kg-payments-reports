// lib/utils/getErrorMessage.ts (or wherever your utils live)

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
    if (error instanceof Error) return error.message;

    if (typeof error === "string") return error;

    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error).code === "string" &&
        error.code === "PGRST116"
    ) {
        return "No Data Found"
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error).message === "string"
    ) {
        return (error).message;
    }


    return fallback;
}
