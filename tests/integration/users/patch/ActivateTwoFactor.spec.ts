import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user has twoFactor activated', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_ACTIVATE_TWO_FACTOR,
            currentFlow: stateFlowsEnum.enum.ACTIVATE_TWO_FACTOR,
            prevStatusMustBe: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        it('should activate with success', async () => {
            const { body: twoFactorResponse } = await requester()
                .patch(`/users/${user.userId}/2fa/activate`)
                .send({
                    question: userDetails.secretQuestion?.question,
                    answer: userDetails.secretQuestion?.answer,
                })
                .expect(HttpStatusCode.OK);

            expect(twoFactorResponse).to.have.property('qrcode');
            expect(twoFactorResponse).to.have.property('active');
            expect(twoFactorResponse).to.have.not.property('secret');
            expect(typeof twoFactorResponse.qrcode).to.be.equal('string');
            expect(twoFactorResponse.active).to.be.equal(true);
        });
    });
});
