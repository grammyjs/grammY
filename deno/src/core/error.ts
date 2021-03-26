import { ApiError } from '../platform.ts'

type ErrorInfo = Omit<ApiError, 'ok'>

/**
 * This class represents errors that are thrown by grammY because the Telegram
 * Bot API responded with an error.
 *
 * Instances of this class hold the information that the Telegram backend
 * returned.
 */
export class GrammyError extends Error implements ErrorInfo {
    public readonly error_code: number
    public readonly description: string
    constructor(
        message: string,
        info: ErrorInfo,
        public readonly payload: object
    ) {
        super(`${message} (${info.error_code}: ${info.description})`)
        this.error_code = info.error_code
        this.description = info.description
    }
}
