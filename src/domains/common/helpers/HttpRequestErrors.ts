import logger from '@tablerise/dynamic-logger';
import { ErrorDetails, ErrorTypes, Errors } from 'src/types/shared/errors';
import { HttpStatusCode } from './HttpStatusCode';
import getErrorName from './getErrorName';
import { ErrorMessage } from './errorMessage';

export default class HttpRequestErrors extends Error {
    code: number;
    details: ErrorDetails[];
    redirectTo: string;

    constructor({
        message = '',
        code = 0,
        details = [],
        name = '',
        redirectTo = '',
    }: Errors) {
        logger('error', `${message} - ${code}`);
        super(message);
        this.code = code;
        this.details = details;
        this.name = name;
        this.redirectTo = redirectTo;
    }

    static throwError(errorType: ErrorTypes, redirectTo?: string): never {
        switch (errorType) {
            case 'campaign-match-inexistent':
                throw new HttpRequestErrors({
                    message: 'Campaign Match does not exist and cannot be updated',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'character-does-not-exist':
                throw new HttpRequestErrors({
                    message: 'Character not found or not belongs to user',
                    code: HttpStatusCode.NOT_FOUND,
                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                });
            case 'player-master-equal':
                throw new HttpRequestErrors({
                    message: 'The new player can not be also the master',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'campaign-inexistent':
                throw new HttpRequestErrors({
                    message: 'Campaign does not exist',
                    code: HttpStatusCode.NOT_FOUND,
                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                });
            case 'music-link-already-added':
                throw new HttpRequestErrors({
                    message: 'Music link already added',
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                });
            case 'player-banned':
                throw new HttpRequestErrors({
                    message: 'Player is banned',
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
            case 'player-already-banned':
                throw new HttpRequestErrors({
                    message: 'Player is already banned',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'player-already-in-match':
                throw new HttpRequestErrors({
                    message: 'Player already in match',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'player-not-in-match':
                throw new HttpRequestErrors({
                    message: 'Player not in match',
                    code: HttpStatusCode.NOT_FOUND,
                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                });
            case 'player-is-the-dungeon-master':
                throw new HttpRequestErrors({
                    message: 'Player is the dungeon master',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'date-already-added':
                throw new HttpRequestErrors({
                    message: 'Date already added',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'info-already-added':
                throw new HttpRequestErrors({
                    message: 'Info already added',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'new-structure-secret-question-missing':
                throw new HttpRequestErrors({
                    message: 'Structure of new for new question and answer is missing',
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                });
            case 'incorrect-secret-question':
                throw new HttpRequestErrors({
                    message: 'Secret question is incorrect',
                    code: HttpStatusCode.UNAUTHORIZED,
                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                });
            case 'content-inexistent':
                throw new HttpRequestErrors({
                    message: 'This content do not exist in the RPG system',
                    code: HttpStatusCode.NOT_FOUND,
                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                });
            case 'query-fail':
                throw new HttpRequestErrors({
                    message: 'Query was not found in database',
                    code: HttpStatusCode.NOT_FOUND,
                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                });
            case 'email-already-exist':
                throw new HttpRequestErrors({
                    message: 'Email already exists in database',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                    redirectTo,
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
            case '2fa-and-secret-question-no-active':
                throw new HttpRequestErrors({
                    message: '2FA not enabled for this user neither secretQuestion',
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
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                });
            case 'query-missing':
                throw new HttpRequestErrors({
                    message: 'Query must not be empty',
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                });
            case 'linked-mandatory-data-when-delete':
                throw new HttpRequestErrors({
                    message: 'There is a campaign or character linked to this user',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            case 'verification-email-send-fail':
                throw new HttpRequestErrors({
                    message: 'Some problem ocurred in email sending',
                    code: HttpStatusCode.EXTERNAL_ERROR,
                    name: getErrorName(HttpStatusCode.EXTERNAL_ERROR),
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
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                });
            case 'unauthorized':
                throw new HttpRequestErrors({
                    message: 'Unauthorized',
                    code: HttpStatusCode.UNAUTHORIZED,
                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                });
            case 'user-database-critical-errror':
                throw new HttpRequestErrors({
                    message: 'User database is not according with User Details database',
                    code: HttpStatusCode.INTERNAL_SERVER,
                    name: getErrorName(HttpStatusCode.INTERNAL_SERVER),
                });
            case 'avatar-inexistent':
                throw new HttpRequestErrors({
                    message: "Doens't exists any avatar in this game",
                    code: HttpStatusCode.INTERNAL_SERVER,
                    name: getErrorName(HttpStatusCode.INTERNAL_SERVER),
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
