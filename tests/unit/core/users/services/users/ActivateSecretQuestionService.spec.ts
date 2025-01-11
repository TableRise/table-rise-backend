import ActivateSecretQuestionService from 'src/core/users/services/users/ActivateSecretQuestionService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import StateMachine from 'src/domains/common/StateMachine';

describe('Core :: Users :: Services :: ActivateSecretQuestionService', () => {
    let activateSecretQuestionService: ActivateSecretQuestionService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        details: UserDetailInstance,
        payload: any,
        stateMachine: any,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#activate', () => {
        context('When activate an user secret question with success', () => {
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
                    stateMachine.props.status.WAIT_TO_ACTIVATE_SECRET_QUESTION;
                userDetails.userId = user.userId;

                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };
                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should return the correct result', async () => {
                const user = await activateSecretQuestionService.activate({
                    userId: 'userId',
                    payload,
                });

                expect(user.user.twoFactorSecret.active).to.be.equal(false);
            });
        });

        context('When activate an user secret question fail - User not exists', () => {
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
                    stateMachine.props.status.WAIT_TO_ACTIVATE_SECRET_QUESTION;
                userDetails.userId = user.userId;

                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };
                usersRepository = {
                    findOne: sinon.spy(() => {}),
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should throw an error if user is missing - user-inexistent', async () => {
                try {
                    await activateSecretQuestionService.activate({
                        userId: '123',
                        payload,
                    });
                    expect(usersRepository.findOne).to.have.been.called();
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });

        context('When activate an user secret question fail - Wrong user status', () => {
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

                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };

                usersRepository = {
                    findOne: sinon.spy(() => user),
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should throw an error if user is missing - user-inexistent', async () => {
                try {
                    await activateSecretQuestionService.activate({
                        userId: '123',
                        payload,
                    });
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

        context('When activate an user secret question fail - Missing payload', () => {
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
                    stateMachine.props.status.WAIT_TO_ACTIVATE_SECRET_QUESTION;
                userDetails.userId = user.userId;

                payload = null;
                usersRepository = {
                    findOne: () => user,
                };
                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should throw an error if - new-structure-secret-question-missing', async () => {
                try {
                    await activateSecretQuestionService.activate({
                        userId: '123',
                        payload,
                    });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Structure of new for new question and answer is missing'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                }
            });
        });
    });

    context('#save', () => {
        context('When save an user secret question with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                details = DomainDataFaker.generateUserDetailsJSON()[0];

                user.twoFactorSecret.active = false;

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                usersDetailsRepository = {
                    update: sinon.spy(() => details),
                };

                activateSecretQuestionService = new ActivateSecretQuestionService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                    stateMachine,
                });
            });

            it('should return the correct result', async () => {
                const twoFactorSecret = await activateSecretQuestionService.save({
                    user,
                    details,
                });

                expect(usersRepository.update).to.have.been.called();
                expect(twoFactorSecret.active).to.be.equal(false);
            });
        });
    });
});
