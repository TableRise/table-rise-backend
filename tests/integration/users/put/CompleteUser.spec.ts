import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an user has the account completed', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.WAIT_TO_COMPLETE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: 'KJJH45',
            };
            user.password = 'oauth';
            user.picture = null;
            user.nickname = null as unknown as string;
            user.providerId = newUUID();

            userDetails.secretQuestion = { question: 'oauth', answer: 'Google' };
            userDetails.birthday = null as unknown as string;
            userDetails.pronoun = null as unknown as string;
            userDetails.firstName = null as unknown as string;
            userDetails.lastName = null as unknown as string;

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should complete the account with success', async () => {
            const payloadToComplete = {
                nickname: 'JhonnyMax',
                firstName: 'Jhon',
                lastName: 'Doe',
                pronoun: 'he/his',
                birthday: '1998-12-25',
            };

            const { body } = await requester()
                .put(`/oauth/${user.userId}/complete`)
                .send(payloadToComplete)
                .expect(HttpStatusCode.OK);

            expect(body.nickname).to.be.equal(payloadToComplete.nickname);
            expect(body.details.firstName).to.be.equal(payloadToComplete.firstName);
            expect(body.details.lastName).to.be.equal(payloadToComplete.lastName);
            expect(body.details.pronoun).to.be.equal(payloadToComplete.pronoun);
            expect(body.details.birthday).to.be.equal(payloadToComplete.birthday);
        });
    });
});
