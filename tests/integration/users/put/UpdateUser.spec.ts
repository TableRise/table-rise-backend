import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user is updated', () => {
    let user: UserInstance, userDetails: UserDetailInstance, userToUpdate: any;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusMustBe: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        beforeEach(() => {
            const user = DomainDataFaker.generateUsersJSON()[0];
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            userToUpdate = {
                nickname: user.nickname,
                details: {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    pronoun: 'he/his',
                    biography: userDetails.biography,
                    birthday: userDetails.birthday,
                },
            };
        });

        it('should update with success', async () => {
            const { body: userBeforeUpdate } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            const { body: userUpdated } = await requester()
                .put(`/users/${user.userId}/update`)
                .send(userToUpdate);

            expect(userUpdated.nickname).to.not.be.equal(userBeforeUpdate.nickname);
            expect(userUpdated.picture).to.not.be.equal(userBeforeUpdate.picture);
            expect(userUpdated.details.firstName).to.not.be.equal(
                userBeforeUpdate.details.firstName
            );
            expect(userUpdated.details.lastName).to.not.be.equal(
                userBeforeUpdate.details.lastName
            );
            expect(userUpdated.details.pronoun).to.not.be.equal(
                userBeforeUpdate.details.pronoun
            );
            expect(userUpdated.details.biography).to.not.be.equal(
                userBeforeUpdate.details.biography
            );
            expect(userUpdated.details.birthday).to.not.be.equal(
                userBeforeUpdate.details.birthday
            );
        });
    });
});
