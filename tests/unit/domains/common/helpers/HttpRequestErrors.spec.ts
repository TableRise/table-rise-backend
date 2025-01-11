import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { ErrorTypes, Errors } from 'src/types/shared/errors';

describe('Domains :: User :: Helpers :: HttpRequestErrors', () => {
    const expectedErrors: Record<ErrorTypes, string> = {
        unauthorized: 'Unauthorized',
        'email-already-exist': 'Email already exists in database',
        'tag-already-exist': 'User with this tag already exists in database',
        'user-inexistent': 'User does not exist',
        '2fa-no-active': '2FA not enabled for this user',
        '2fa-and-secret-question-no-active':
            '2FA not enabled for this user neither secretQuestion',
        '2fa-already-active': '2FA is already enabled for this user',
        '2fa-incorrect': 'Two factor code does not match',
        'rpg-not-found-id': 'NotFound an object with provided ID',
        'query-string-incorrect': 'Query must be a string',
        'query-missing': 'Query must not be empty',
        'invalid-user-status': 'User status is invalid to perform this operation',
        'invalid-email-verify-code': 'Invalid email verify code',
        'linked-mandatory-data-when-delete':
            'There is a campaign or character linked to this user',
        'verification-email-send-fail': 'Some problem ocurred in email sending',
        'user-database-critical-errror':
            'User database is not according with User Details database',
        'query-fail': 'Query was not found in database',
        'info-already-added': 'Info already added',
        'content-inexistent': 'This content do not exist in the RPG system',
        'incorrect-secret-question': 'Secret question is incorrect',
        'new-structure-secret-question-missing':
            'Structure of new for new question and answer is missing',
        'blank-question-or-answer': 'Some error not specified ocurred',
        'campaign-match-inexistent':
            'Campaign Match does not exist and cannot be updated',

        login: 'Some error not specified ocurred',
        'linked-data': 'Some error not specified ocurred',
        'verification-email': 'Some error not specified ocurred',
        'campaign-inexistent': 'Campaign does not exist',
        'music-link-already-added': 'Music link already added',
        'date-already-added': 'Date already added',
        'player-already-in-match': 'Player already in match',
        'player-banned': 'Player is banned',
        'avatar-inexistent': "Doens't exists any avatar in this game",
        'character-does-not-exist': 'Character not found or not belongs to user',
        'player-master-equal': 'The new player can not be also the master',
    };

    context('When an error is throwed by HttpRequestErrors', () => {
        it('should throw expected error', () => {
            for (const [key, value] of Object.entries(expectedErrors)) {
                expect(() => HttpRequestErrors.throwError(key as ErrorTypes)).to.throw(
                    value
                );
            }
        });

        it('should be instanceOf HttpRequestErrors', () => {
            try {
                throw new HttpRequestErrors({
                    message: 'Error test',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).to.have.property('message');
                expect(err).to.have.property('code');
                expect(err).to.have.property('name');
                expect(err.message).to.be.equal('Error test');
                expect(err.code).to.be.equal(400);
                expect(err.name).to.be.equal('BadRequest');
            }
        });

        it('should throw if nothing is passed', () => {
            try {
                throw new HttpRequestErrors({} as Errors);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).to.have.property('message');
                expect(err).to.have.property('code');
                expect(err).to.have.property('name');
                expect(err.message).to.be.equal('');
                expect(err.code).to.be.equal(0);
                expect(err.name).to.be.equal('');
            }
        });
    });
});
