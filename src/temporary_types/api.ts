export interface ApiError {
    ok: false;
    error_code: number;
    description: string;
    parameters?: ResponseParameters;
}

export interface ApiSuccess<T> {
    ok: true;
    result: T;
}

/** The response contains an object, which always has a Boolean field 'ok' and may have an optional String field 'description' with a human-readable description of the result. If 'ok' equals true, the request was successful and the result of the query can be found in the 'result' field. In case of an unsuccessful request, 'ok' equals false and the error is explained in the 'description'. An Integer 'error_code' field is also returned, but its contents are subject to change in the future. Some errors may also have an optional field 'parameters' of the type ResponseParameters, which can help to automatically handle the error.

All methods in the Bot API are case-insensitive.
All queries must be made using UTF-8. */
export type ApiResponse<T> = ApiError | ApiSuccess<T>;

/** Describes why a request was unsuccessful. */
export interface ResponseParameters {
    /** The group has been migrated to a supergroup with the specified identifier. */
    migrate_to_chat_id?: number;
    /** In case of exceeding flood control, the number of seconds left to wait before the request can be repeated */
    retry_after?: number;
}
