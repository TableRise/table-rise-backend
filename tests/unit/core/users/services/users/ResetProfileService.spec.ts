import sinon from 'sinon';
import ResetProfileService from 'src/core/users/services/users/ResetProfileService';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import StateMachine from 'src/domains/common/StateMachine';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: ResetProfileService', () => {
    let resetProfileService: ResetProfileService,
        usersDetailsRepository: any,
        usersRepository: any,
        user: UserInstance,
        currentUserDetails: UserDetailInstance;

    const logger = (): void => {};

    const stateMachine = {
        props: StateMachine.prototype.props,
        machine: () => ({
            userId: '123',
            inProgress: { status: 'done' },
            twoFactorSecret: { active: true },
            updatedAt: '12-12-2024T00:00:00Z',
        }),
    } as any;

    context('#reset', () => {
        context('When user profile is reseted with success', () => {
            const userId = newUUID();

            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                currentUserDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                user.inProgress.status = stateMachine.props.status.WAIT_TO_RESET_PROFILE;

                currentUserDetails.gameInfo.badges = ['123'];
                currentUserDetails.gameInfo.campaigns = ['123'];
                currentUserDetails.gameInfo.characters = ['123'];

                usersRepository = {
                    findOne: sinon.spy(() => user),
                    update: sinon.spy(),
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => currentUserDetails),
                    update: sinon.spy(),
                };

                resetProfileService = new ResetProfileService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should call correct methods', async () => {
                await resetProfileService.reset(userId);
                expect(usersRepository.findOne).to.have.been.called();
                expect(usersRepository.update).to.have.been.called();
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: currentUserDetails.userDetailId },
                    payload: currentUserDetails,
                });
            });
        });

        context('When user profile is reseted but user status is wrong', () => {
            const userId = newUUID();

            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                currentUserDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                user.inProgress.status =
                    stateMachine.props.status.WAIT_TO_ACTIVATE_TWO_FACTOR;

                currentUserDetails.gameInfo.badges = ['123'];
                currentUserDetails.gameInfo.campaigns = ['123'];
                currentUserDetails.gameInfo.characters = ['123'];

                usersRepository = {
                    findOne: sinon.spy(() => user),
                    update: sinon.spy(),
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => currentUserDetails),
                    update: sinon.spy(),
                };

                resetProfileService = new ResetProfileService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should call correct methods', async () => {
                try {
                    await resetProfileService.reset(userId);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'User status is invalid to perform this operation'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });
});
