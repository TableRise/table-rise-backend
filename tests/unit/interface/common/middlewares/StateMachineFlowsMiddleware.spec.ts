import sinon from 'sinon';
import { Request, Response } from 'express';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import StateMachineFlowsMiddleware from 'src/interface/common/middlewares/StateMachineFlowsMiddleware';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Interface :: Common :: Middlewares :: StateMachineFlowsMiddleware', () => {
    let stateMachineFlowsMiddleware: StateMachineFlowsMiddleware,
        usersRepository: any,
        user: any;

    const logger = (): any => {};

    context('#setNewFlow', () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = sinon.spy(() => {});

        context('When new flow is set', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.inProgress.currentFlow =
                    InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER;

                const userWithNewStatus = user;
                userWithNewStatus.inProgress.currentFlow =
                    stateFlowsEnum.enum.ACTIVATE_SECRET_QUESTION;

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => userWithNewStatus),
                };

                stateMachineFlowsMiddleware = new StateMachineFlowsMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should update successfully the currentFlow', async () => {
                req.params = { id: '123' };
                req.query = { flow: stateFlowsEnum.enum.ACTIVATE_SECRET_QUESTION };

                await stateMachineFlowsMiddleware.setNewFlow(req, res, next);

                expect(usersRepository.update).to.have.been.called();
            });
        });

        context('When new flow is set - email query', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.inProgress.currentFlow =
                    InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER;

                const userWithNewStatus = user;
                userWithNewStatus.inProgress.currentFlow =
                    stateFlowsEnum.enum.ACTIVATE_SECRET_QUESTION;

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => userWithNewStatus),
                };

                stateMachineFlowsMiddleware = new StateMachineFlowsMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should update successfully the currentFlow', async () => {
                delete req.params.id;

                req.query = {
                    email: user.email,
                    flow: stateFlowsEnum.enum.ACTIVATE_SECRET_QUESTION,
                };

                await stateMachineFlowsMiddleware.setNewFlow(req, res, next);

                expect(usersRepository.update).to.have.been.called();
            });
        });

        context('When new flow is not set - user does not exist', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.inProgress.currentFlow =
                    InProgressStatusEnum.enum.WAIT_TO_FINISH_DELETE_USER;

                const userWithNewStatus = user;
                userWithNewStatus.inProgress.currentFlow =
                    stateFlowsEnum.enum.ACTIVATE_SECRET_QUESTION;

                usersRepository = {
                    findOne: () => {},
                    update: sinon.spy(() => userWithNewStatus),
                };

                stateMachineFlowsMiddleware = new StateMachineFlowsMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should not update successfully the currentFlow and throw error', async () => {
                try {
                    req.params = { id: '123' };
                    req.query = { flow: stateFlowsEnum.enum.ACTIVATE_SECRET_QUESTION };

                    await stateMachineFlowsMiddleware.setNewFlow(req, res, next);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(usersRepository.update).to.not.have.been.called();
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });
    });
});
