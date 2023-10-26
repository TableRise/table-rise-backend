import logger from '@tablerise/dynamic-logger';
import { ErrorDetails, ErrorTypes, Errors } from 'src/types/Errors';
import { HttpStatusCode } from './HttpStatusCode';
import getErrorName from './getErrorName';
import { ErrorMessage } from './errorMessage';

export default class HttpRequestErrors extends Error {
    code: number;
    details: ErrorDetails[];

    constructor({ message, code, details, name }: Errors) {
        logger('error', `${message} - ${code}`);
        super(message);
        this.code = code;
        this.details = details as ErrorDetails[];
        this.name = name as string;
    }

    static throwError(errorType: ErrorTypes): never {
        switch (errorType) {
            case 'blank-question-or-answer':
                throw new HttpRequestErrors({
                    message: 'SecretQuestion has a blank question or answer',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'email-already-exist':
                throw new HttpRequestErrors({
                    message: 'Email already exists in database',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'tag-already-exist':
                throw new HttpRequestErrors({
                    message: 'User with this tag already exists in database',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'user-inexistent':
                throw new HttpRequestErrors({
                    message: 'User does not exist',
                    code: HttpStatusCode.NOT_FOUND,
                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                });

            case '2fa-no-active':
                throw new HttpRequestErrors({
                    message: '2FA not enabled for this user',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case '2fa-already-active':
                throw new HttpRequestErrors({
                    message: '2FA is already enabled for this user',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case '2fa-incorrect':
                throw new HttpRequestErrors({
                    message: 'Two factor code does not match',
                    code: HttpStatusCode.UNAUTHORIZED,
                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                });

            case 'rpg-not-found-id':
                throw new HttpRequestErrors({
                    message: ErrorMessage.NOT_FOUND_BY_ID,
                    code: HttpStatusCode.NOT_FOUND,
                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                });

            case 'query-string-incorrect':
                throw new HttpRequestErrors({
                    message: 'Query must be a string',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'query-missing':
                throw new HttpRequestErrors({
                    message: 'Query must not be empty',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'linked-mandatory-data-when-delete':
                throw new HttpRequestErrors({
                    message: 'There is a campaing or character linked to this user',
                    code: HttpStatusCode.UNAUTHORIZED,
                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                });

            case 'verification-email-send-fail':
                throw new HttpRequestErrors({
                    message: 'Some problem ocurred in email sending',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'invalid-user-status':
                throw new HttpRequestErrors({
                    message: 'User status is invalid to perform this operation',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'invalid-email-verify-code':
                throw new HttpRequestErrors({
                    message: 'Invalid email verify code',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'unauthorized':
                throw new HttpRequestErrors({
                    message: 'Unauthorized',
                    code: HttpStatusCode.UNAUTHORIZED,
                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                });

            default:
                throw new HttpRequestErrors({
                    message: 'Some error not specified ocurred',
                    code: HttpStatusCode.INTERNAL_SERVER,
                    name: getErrorName(HttpStatusCode.INTERNAL_SERVER),
                });
        }
    }
}
