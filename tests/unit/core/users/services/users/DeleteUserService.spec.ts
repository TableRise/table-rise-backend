import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DeleteUserService from 'src/core/users/services/users/DeleteUserService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { throwErrorAssert } from 'tests/support/throwErrorAssertion';
import sinon from 'sinon';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import StateMachine from 'src/domains/common/StateMachine';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Users :: Services :: DeleteUserService', () => {
    let deleteUsersService: DeleteUserService,
        usersRepository: any,
        stateMachine: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userUpdated: UserInstance,
        message: string,
        code: number,
        userDetails: UserDetailInstance;

    const logger = sinon.spy((): void => {});

    context('#Delete', () => {
        context('When delete a user with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                userDetails.userId = user.userId;
                userUpdated = { ...user };

                stateMachine = {
                    props: StateMachine.prototype.props,
                    machine: () => ({
                        userId: '123',
                        inProgress: { status: 'done' },
                        twoFactorSecret: { active: true },
                        updatedAt: '12-12-2024T00:00:00Z',
                    }),
                };

                userUpdated.inProgress.status =
                    InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER;

                usersRepository = { findOne: () => user, update: () => userUpdated };

                usersDetailsRepository = { findOne: () => userDetails };

                sinon.spy(usersRepository, 'update');

                deleteUsersService = new DeleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should return the correct result', async () => {
                await deleteUsersService.delete(user.userId);

                expect(usersRepository.update).to.have.been.called();
                expect(usersRepository.update).to.have.been.called();
                expect(logger).to.have.been.calledWith(
                    'info',
                    `Delete Service - User waiting to be deleted from database with ID ${userUpdated.userId} and status ${userUpdated.inProgress.status}`
                );
            });
        });

        context('When delete a user with wrong status', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userUpdated = { ...user };
                userUpdated.inProgress.status =
                    InProgressStatusEnum.enum.WAIT_TO_CHANGE_EMAIL;
                usersRepository = { findOne: () => user, update: () => userUpdated };
                usersDetailsRepository = { findOne: () => userDetails };
                sinon.spy(usersRepository, 'update');

                deleteUsersService = new DeleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should return the correct result', async () => {
                try {
                    await deleteUsersService.delete(user.userId);
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

        context('When a user not exist', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                message = 'User does not exist';
                code = HttpStatusCode.NOT_FOUND;
                userDetails.gameInfo.campaigns = ['Lavanda'];
                userUpdated = { ...user };
                userUpdated.inProgress.status =
                    InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;
                usersRepository = { findOne: () => user, update: () => userUpdated };
                usersDetailsRepository = { findOne: () => {} };

                deleteUsersService = new DeleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should return HTTPRequestEroor: user-inexistent', async () => {
                try {
                    await deleteUsersService.delete(user.userId);
                } catch (error) {
                    throwErrorAssert(error as HttpRequestErrors, message, code);
                }
            });
        });

        context('When gameinfo campaign or character exists', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                message = 'There is a campaign or character linked to this user';
                code = HttpStatusCode.BAD_REQUEST;
                userDetails.gameInfo.campaigns = ['1st Mission'];
                userDetails.gameInfo.characters = ['Levi'];
                userUpdated = { ...user };
                userUpdated.inProgress.status =
                    InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER;
                usersRepository = { findOne: () => user, update: () => userUpdated };
                usersDetailsRepository = { findOne: () => userDetails };

                deleteUsersService = new DeleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should return HTTPRequestEroor: linked-mandatory-data-when-delete', async () => {
                try {
                    await deleteUsersService.delete(user.userId);
                } catch (error) {
                    throwErrorAssert(error as HttpRequestErrors, message, code);
                }
            });
        });
    });
});
