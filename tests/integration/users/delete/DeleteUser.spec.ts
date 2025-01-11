import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an user is deleted', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER;

            user.inProgress = {
                status: InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER,
                currentFlow: stateFlowsEnum.enum.DELETE_PROFILE,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.WAIT_TO_DELETE_USER,
                code: '',
            };

            user.twoFactorSecret = { active: true, secret: '', qrcode: '' };
            userDetails.secretQuestion = null;

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should delete user with success', async () => {
            await requester()
                .delete(`/users/${user.userId}/delete`)
                .expect(HttpStatusCode.NO_CONTENT);

            await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.NOT_FOUND);
        });
    });

    context('And all data is correct - secret question', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER,
                currentFlow: stateFlowsEnum.enum.DELETE_PROFILE,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.WAIT_TO_DELETE_USER,
                code: '',
            };

            user.twoFactorSecret = { active: false, secret: '', qrcode: '' };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should delete user with success', async () => {
            await requester()
                .delete(`/users/${user.userId}/delete`)
                .send({
                    question: userDetails.secretQuestion?.question,
                    answer: userDetails.secretQuestion?.answer,
                })
                .expect(HttpStatusCode.NO_CONTENT);

            await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.NOT_FOUND);
        });
    });
});
