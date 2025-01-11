import sinon from 'sinon';
import StateMachine from 'src/domains/common/StateMachine';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
// import getErrorName from 'src/domains/common/helpers/getErrorName';
// import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
// import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: User :: StateMachine', () => {
    let stateMachine: StateMachine, usersRepository: any, user: any;

    const logger = (): any => {};

    context('When a flow is used in StateMachine', () => {
        context('And this flow is: update-password', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should return correct next step', async () => {
                user.inProgress = {
                    status: InProgressStatusEnum.enum.DONE,
                    currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                    prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 1);

                user.inProgress = {
                    status: InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 2);

                user.inProgress = {
                    status: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusMustBe:
                        InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                    nextStatusWillBe:
                        InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 3);

                user.inProgress = {
                    status: InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusMustBe: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                    nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 4);
            });
        });

        context('And this flow is: update-password - but prev status is wrong', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should throw correct error', async () => {
                try {
                    user.inProgress = {
                        status: InProgressStatusEnum.enum.DONE,
                        currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                        prevStatusMustBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                        nextStatusWillBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                        code: '',
                    };

                    await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Entity actual status is done and previous status should be wait-for-new-flow but is actually done'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                }
            });
        });

        context('And this flow is: update-password - but next status is wrong', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should throw correct error', async () => {
                try {
                    user.inProgress = {
                        status: InProgressStatusEnum.enum.DONE,
                        currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                        prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                        nextStatusWillBe:
                            InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE,
                        code: '',
                    };

                    await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Entity actual status is done and next status should be wait-to-finish-password-change but is actually wait-to-start-password-change'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                }
            });
        });

        context('And this flow is: create-user', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should throw correct error', async () => {
                try {
                    user.inProgress = {
                        status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                        currentFlow: stateFlowsEnum.enum.CREATE_USER,
                        prevStatusMustBe: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                        nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                        code: '',
                    };

                    await stateMachine.machine(stateFlowsEnum.enum.CREATE_USER, user);

                    sinon.assert.callCount(usersRepository.update, 1);

                    user.inProgress = {
                        status: InProgressStatusEnum.enum.DONE,
                        currentFlow: stateFlowsEnum.enum.CREATE_USER,
                        prevStatusMustBe: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                        nextStatusWillBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                        code: '',
                    };

                    await stateMachine.machine(stateFlowsEnum.enum.CREATE_USER, user);

                    sinon.assert.callCount(usersRepository.update, 2);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Entity actual status is done and next status should be wait-to-finish-password-change but is actually wait-to-start-password-change'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                }
            });
        });
    });
});
