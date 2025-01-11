import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user has secret question activated', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_UPDATE_SECRET_QUESTION,
            currentFlow: stateFlowsEnum.enum.UPDATE_SECRET_QUESTION,
            prevStatusMustBe: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };
        userDetails.secretQuestion = {
            question: 'to-be-updated-question',
            answer: 'to-be-updated-answer',
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        it('should update with success', async () => {
            const newSecretQuestion = {
                question: 'what-is-your-grandfather-last-name',
                answer: 'Marcus',
            };

            const { body: userWithOldSecretQuestion } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            await requester()
                .patch(`/users/${user.userId}/question/update`)
                .send(newSecretQuestion)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body: userWithNewQuestion } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(userWithNewQuestion.details.secretQuestion).to.be.not.null();
            expect(userWithNewQuestion.twoFactorSecret).to.be.deep.equal({
                active: false,
            });
            expect(userWithNewQuestion.details.secretQuestion.answer).to.be.equal(
                newSecretQuestion.answer
            );
            expect(userWithNewQuestion.details.secretQuestion.answer).to.be.not.equal(
                userDetails.secretQuestion?.answer
            );
            expect(userWithNewQuestion.details.secretQuestion.question).to.be.equal(
                newSecretQuestion.question
            );
            expect(userWithNewQuestion.updatedAt).to.be.not.equal(
                userWithOldSecretQuestion.updatedAt
            );
        });
    });
});
