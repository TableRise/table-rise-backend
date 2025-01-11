import path from 'path';
import ActivateTwoFactorService from 'src/core/users/services/users/ActivateTwoFactorService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import StateMachine from 'src/domains/common/StateMachine';
import sinon from 'sinon';

const configs = require(path.join(process.cwd(), 'tablerise.environment.js'));

describe('Core :: Users :: Services :: ActivateTwoFactorService', () => {
    let activateTwoFactorService: ActivateTwoFactorService,
        usersRepository: any,
        usersDetailsRepository: any,
        twoFactorHandler: TwoFactorHandler,
        stateMachine: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#activate', () => {
        context('When activate an user two factor with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                stateMachine = {
                    props: StateMachine.prototype.props,
                    machine: () => ({
                        userId: '123',
                        inProgress: { status: 'done' },
                        twoFactorSecret: { active: true },
                        updatedAt: '12-12-2024T00:00:00Z',
                    }),
                };

                user.inProgress.status =
                    stateMachine.props.status.WAIT_TO_ACTIVATE_TWO_FACTOR;
                userDetails.userId = user.userId;

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await activateTwoFactorService.activate('userId');

                expect(userTest.user).to.be.equal(user);
                expect(userTest.userDetails).to.be.equal(userDetails);
            });
        });

        context('When activate an user two factor but user status is wrong', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                stateMachine = {
                    props: StateMachine.prototype.props,
                    machine: () => ({
                        userId: '123',
                        inProgress: { status: 'done' },
                        twoFactorSecret: { active: true },
                        updatedAt: '12-12-2024T00:00:00Z',
                    }),
                };

                user.inProgress.status = stateMachine.props.status.WAIT_TO_COMPLETE;
                userDetails.userId = user.userId;

                usersRepository = {
                    findOne: sinon.spy(() => user),
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                try {
                    await activateTwoFactorService.activate('userId');
                    expect(usersRepository.findOne).to.have.been.called();
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

        context('When activate an user two factor fail | 2fa-already-active', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                stateMachine = {
                    props: StateMachine.prototype.props,
                    machine: () => ({
                        userId: '123',
                        inProgress: { status: 'done' },
                        twoFactorSecret: { active: true },
                        updatedAt: '12-12-2024T00:00:00Z',
                    }),
                };

                user.inProgress.status =
                    stateMachine.props.status.WAIT_TO_ACTIVATE_TWO_FACTOR;

                userDetails.userId = user.userId;
                user.twoFactorSecret.active = true;

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    stateMachine,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await activateTwoFactorService.activate('userId', false);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        '2FA is already enabled for this user'
                    );
                    expect(err.name).to.be.equal('BadRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });

    context('#save', () => {
        context('When save an user two factor with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                userDetails.userId = user.userId;

                usersRepository = {
                    update: () => user,
                };

                usersDetailsRepository = {
                    update: () => userDetails,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                activateTwoFactorService = new ActivateTwoFactorService({
                    usersRepository,
                    usersDetailsRepository,
                    twoFactorHandler,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const result = await activateTwoFactorService.save({
                    user,
                    userDetails,
                });

                expect(result.active).to.be.equal(false);
            });
        });
    });
});
