import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user has secret question activated', () => {
    let user: UserInstance, secretQuestion: any, userDetails: UserDetailInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        secretQuestion = {
            question: 'what-is-your-grandfather-last-name',
            answer: 'Silvera',
        };
        userDetails.secretQuestion = secretQuestion;
        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_ACTIVATE_SECRET_QUESTION,
            currentFlow: stateFlowsEnum.enum.ACTIVATE_SECRET_QUESTION,
            prevStatusMustBe: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };
        user.twoFactorSecret = { active: true, qrcode: '' };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        it('should activate with success', async () => {
            await requester()
                .patch(`/users/${user.userId}/question/activate`)
                .send(secretQuestion)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body: userWithSecretQuestion } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(userWithSecretQuestion.details.secretQuestion).to.be.not.null();
            expect(userWithSecretQuestion.twoFactorSecret).to.be.deep.equal({
                active: false,
            });
        });
    });
});
