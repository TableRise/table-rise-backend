import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When game info of an user is reset', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.WAIT_TO_RESET_PROFILE,
                currentFlow: stateFlowsEnum.enum.RESET_PROFILE,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            userDetails.gameInfo.badges = ['123'];
            userDetails.gameInfo.campaigns = ['123', '123', '123'];
            userDetails.gameInfo.characters = ['123', '123'];

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should reset user with success', async () => {
            await requester()
                .patch(`/users/${user.userId}/reset`)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.have.property('details');
            expect(body.details.gameInfo.badges).to.be.an('array').that.has.lengthOf(0);
            expect(body.details.gameInfo.campaigns)
                .to.be.an('array')
                .that.has.lengthOf(0);
            expect(body.details.gameInfo.characters)
                .to.be.an('array')
                .that.has.lengthOf(0);
        });
    });
});
