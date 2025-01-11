import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';
// import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('When the user is logged in', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And the credentials are valid', () => {
        beforeEach(async () => {
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

        it('should do successfull login', async () => {
            const login = {
                email: user.email,
                password: 'TheWorld@122',
            };

            const { body } = await requester().post('/users/login').send(login);

            expect(body).to.have.property('userId');
            expect(body.userId).to.be.equal(user.userId);
            expect(body.providerId).to.be.equal(user.providerId);
            expect(body.username).to.be.equal(`${user.nickname}${user.tag}`);
            expect(body.picture.id).to.be.equal(user.picture?.id);
            expect(body.picture.link).to.be.equal(user.picture?.link);
            expect(body.picture.uploadDate).to.be.equal(user.picture?.uploadDate);
            expect(body.fullname).to.be.equal(
                `${userDetails.firstName} ${userDetails.lastName}`
            );
        });
    });
});
