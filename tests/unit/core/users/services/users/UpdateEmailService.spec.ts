import sinon from 'sinon';
import UpdateEmailService from 'src/core/users/services/users/UpdateEmailService';
import StateMachine from 'src/domains/common/StateMachine';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: UpdateEmailService', () => {
    let updateEmailService: UpdateEmailService,
        user: UserInstance,
        newUser: UserInstance,
        usersRepository: any,
        updateEmailPayload: any;

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

    context('#update', () => {
        context('When an email is updated', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress = {
                    ...user.inProgress,
                    status: InProgressStatusEnum.enum.WAIT_TO_FINISH_EMAIL_CHANGE,
                    currentFlow: stateFlowsEnum.enum.UPDATE_EMAIL,
                    prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                };

                updateEmailPayload = {
                    userId: user.userId,
                    code: user.inProgress.code,
                    email: 'testnew@email.com',
                };

                newUser = {
                    ...user,
                    email: updateEmailPayload.email,
                    inProgress: {
                        status: InProgressStatusEnum.enum.WAIT_TO_FINISH_EMAIL_CHANGE,
                        currentFlow: stateFlowsEnum.enum.UPDATE_EMAIL,
                        prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                        nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                        code: updateEmailPayload.code,
                    },
                };

                usersRepository = {
                    findOne: sinon.spy(() => user),
                    find: () => [],
                    update: sinon.spy(),
                };

                updateEmailService = new UpdateEmailService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                await updateEmailService.update(updateEmailPayload);
                expect(usersRepository.findOne).to.have.been.called();
                expect(usersRepository.update).to.have.been.calledWith({
                    query: { userId: user.userId },
                    payload: newUser,
                });
            });
        });

        context('When an email is updated but user status is wrong', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_CHANGE_EMAIL;

                updateEmailPayload = {
                    userId: user.userId,
                    code: user.inProgress.code,
                    email: 'testnew@email.com',
                };

                newUser = {
                    ...user,
                    email: updateEmailPayload.email,
                    inProgress: {
                        status: InProgressStatusEnum.enum.DONE,
                        currentFlow: stateFlowsEnum.enum.UPDATE_EMAIL,
                        prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                        nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                        code: updateEmailPayload.code,
                    },
                };

                usersRepository = {
                    findOne: sinon.spy(() => user),
                    find: () => [],
                    update: sinon.spy(),
                };

                updateEmailService = new UpdateEmailService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                try {
                    await updateEmailService.update(updateEmailPayload);
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

        context('When an email is updated - email is invalid', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status =
                    InProgressStatusEnum.enum.WAIT_TO_FINISH_EMAIL_CHANGE;

                updateEmailPayload = {
                    userId: user.userId,
                    code: user.inProgress.code,
                    email: user.email,
                };

                newUser = {
                    ...user,
                    email: updateEmailPayload.email,
                    inProgress: {
                        status: InProgressStatusEnum.enum.DONE,
                        currentFlow: stateFlowsEnum.enum.UPDATE_EMAIL,
                        prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                        nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                        code: updateEmailPayload.code,
                    },
                };

                usersRepository = {
                    findOne: sinon.spy(() => user),
                    find: () => [{ email: user.email }],
                    update: sinon.spy(),
                };

                updateEmailService = new UpdateEmailService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                try {
                    await updateEmailService.update(updateEmailPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Email already exists in database');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });
    });
});
