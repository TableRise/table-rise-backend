import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an user has the email changed', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.WAIT_TO_FINISH_EMAIL_CHANGE,
                currentFlow: stateFlowsEnum.enum.UPDATE_EMAIL,
                prevStatusMustBe: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: 'H45J7F',
            };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should update email with success', async () => {
            await requester()
                .patch(`/users/${user.userId}/update/email`)
                .send({ email: 'test155@email.com' })
                .expect(HttpStatusCode.NO_CONTENT);

            const { body } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(body.email).to.be.not.equal(user.email);
            expect(body.email).to.be.equal('test155@email.com');
        });
    });
});
