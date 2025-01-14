import { Request, Response, NextFunction } from 'express';
import sinon from 'sinon';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import StateMachine from 'src/domains/common/StateMachine';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import VerifyEmailCodeMiddleware from 'src/interface/users/middlewares/VerifyEmailCodeMiddleware';

describe('Interface :: Users :: Middlewares :: VerifyEmailCodeMiddleware', () => {
    let verifyEmailCodeMiddleware: VerifyEmailCodeMiddleware,
        usersRepository: any,
        usersDetailsRepository: any,
        user: any;

    const logger = (): unknown => ({});

    const stateMachine = {
        props: StateMachine.prototype.props,
        machine: sinon.spy(() => ({
            userId: '123',
            inProgress: { status: 'done' },
            twoFactorSecret: { active: true },
            updatedAt: '12-12-2024T00:00:00Z',
        })),
    } as any;

    context('When the user has the email code verified', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        response.status = sinon.spy(() => response);
        response.json = sinon.spy(() => response);

        context('And params are correct', () => {
            beforeEach(() => {
                user = {
                    userId: '123',
                    inProgress: {
                        status: InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                        code: 'KLI44',
                    },
                    twoFactorSecret: { active: true },
                };

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(),
                };

                usersDetailsRepository = {
                    findOne: () => ({
                        secretQuestion: { question: 'What is your favorite color?' },
                    }),
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should call next - when has ID', async () => {
                request.params = { id: '123' };
                request.query = { code: 'KLI44', flow: 'update-password' };

                await verifyEmailCodeMiddleware.verify(request, response, next);

                user.inProgress.status = InProgressStatusEnum.enum.DONE;

                expect(stateMachine.machine).to.have.been.called();
                expect(next).to.have.been.called();
            });

            it('should call next - when has email', async () => {
                delete request.params.id;
                request.query = {
                    email: 'test@email.com',
                    code: 'KLI44',
                    flow: 'update-password',
                };

                await verifyEmailCodeMiddleware.verify(request, response, next);

                user.inProgress.status = InProgressStatusEnum.enum.DONE;

                expect(stateMachine.machine).to.have.been.called();
                expect(next).to.have.been.called();
            });
        });

        context(
            'And the parameters are correct but userRepositoryDetails has not been created yet',
            () => {
                beforeEach(() => {
                    user = {
                        userId: '123',
                        inProgress: {
                            status: InProgressStatusEnum.enum
                                .WAIT_TO_START_PASSWORD_CHANGE,
                            code: 'KLI44',
                        },
                        twoFactorSecret: { active: true },
                    };

                    usersRepository = {
                        findOne: () => user,
                        update: sinon.spy(),
                    };

                    usersDetailsRepository = {
                        findOne: () => {
                            // eslint-disable-next-line @typescript-eslint/no-throw-literal
                            throw HttpRequestErrors.throwError('user-inexistent');
                        },
                    };

                    verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                        usersRepository,
                        usersDetailsRepository,
                        stateMachine,
                        logger,
                    });
                });

                it('should call next - when has ID', async () => {
                    request.params = { id: '123' };
                    request.query = { code: 'KLI44', flow: 'update-password' };

                    await verifyEmailCodeMiddleware.verify(request, response, next);

                    user.inProgress.status = InProgressStatusEnum.enum.DONE;

                    expect(stateMachine.machine).to.have.been.called();
                    expect(next).to.have.been.called();
                });

                it('should call next - when has email', async () => {
                    delete request.params.id;
                    request.query = {
                        email: 'test@email.com',
                        code: 'KLI44',
                        flow: 'update-password',
                    };

                    await verifyEmailCodeMiddleware.verify(request, response, next);

                    user.inProgress.status = InProgressStatusEnum.enum.DONE;

                    expect(stateMachine.machine).to.have.been.called();
                    expect(next).to.have.been.called();
                });
            }
        );

        context('And params are correct - user has secret question', () => {
            beforeEach(() => {
                user = {
                    userId: '123',
                    inProgress: {
                        status: InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                        code: 'KLI44',
                    },
                    twoFactorSecret: { active: false },
                };

                stateMachine.machine = sinon.spy(() => ({
                    userId: '123',
                    inProgress: { status: 'done' },
                    twoFactorSecret: { active: false },
                    updatedAt: '12-12-2024T00:00:00Z',
                }));

                usersDetailsRepository = {
                    findOne: () => ({
                        secretQuestion: { question: 'What is your favorite color?' },
                    }),
                };

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(),
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should call next - when has ID', async () => {
                request.params = { id: '123' };
                request.query = { code: 'KLI44', flow: 'update-password' };

                await verifyEmailCodeMiddleware.verify(request, response, next);

                user.inProgress.status = InProgressStatusEnum.enum.DONE;

                expect(stateMachine.machine).to.have.been.called();
                expect(next).to.have.been.called();
            });

            it('should call next - when has email', async () => {
                // delete request.params.id;
                request.query = {
                    email: 'test@email.com',
                    code: 'KLI44',
                    flow: 'update-password',
                };

                request.params = { id: '123' };

                await verifyEmailCodeMiddleware.verify(request, response, next);

                user.inProgress.status = InProgressStatusEnum.enum.DONE;

                expect(stateMachine.machine).to.have.been.called();
                expect(next).to.have.been.called();
            });
        });

        context('And params are incorrect', () => {
            beforeEach(() => {
                usersRepository = { findOne: () => null };

                usersDetailsRepository = { findOne: () => null };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should throw an error - no id or email', async () => {
                try {
                    delete request.params.id;
                    request.query = { code: 'KLI44' };
                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Neither id or email was provided to validate the email code'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal('BadRequest');
                }
            });
        });

        context('And params are incorrect - id or email inexistent', () => {
            beforeEach(() => {
                usersRepository = {
                    findOne: () => {
                        // eslint-disable-next-line @typescript-eslint/no-throw-literal
                        throw HttpRequestErrors.throwError('user-inexistent');
                    },
                };

                usersDetailsRepository = {
                    findOne: () => {
                        // eslint-disable-next-line @typescript-eslint/no-throw-literal
                        throw HttpRequestErrors.throwError('user-inexistent');
                    },
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    usersRepository,
                    usersDetailsRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should throw an error - id inexistent', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { code: 'KLI44' };
                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });

            it('should throw an error - email inexistent', async () => {
                try {
                    request.query = { email: 'test@email.com', code: 'KLI44' };
                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });

        context('And params are correct - but code is invalid', () => {
            beforeEach(() => {
                usersRepository = {
                    findOne: () => ({
                        inProgress: {
                            status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                            code: 'KLI44',
                        },
                    }),
                };

                usersDetailsRepository = {
                    findOne: () => ({
                        secretQuestion: { question: 'What is your favorite color?' },
                    }),
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    stateMachine,
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { code: 'KLI00' };

                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Invalid email verify code');
                    expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY)
                    );
                }
            });
        });

        context('And params are correct - but user status is invalid', () => {
            beforeEach(() => {
                usersRepository = {
                    findOne: () => ({
                        inProgress: {
                            status: InProgressStatusEnum.enum.WAIT_TO_DELETE_USER,
                            code: 'KLI44',
                        },
                    }),
                };

                usersDetailsRepository = {
                    findOne: () => ({
                        secretQuestion: { question: 'What is your favorite color?' },
                    }),
                };

                verifyEmailCodeMiddleware = new VerifyEmailCodeMiddleware({
                    stateMachine,
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    request.params = { id: '123' };
                    request.query = { code: 'KLI44' };

                    await verifyEmailCodeMiddleware.verify(request, response, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'User status is invalid to perform this operation'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });
    });
});
