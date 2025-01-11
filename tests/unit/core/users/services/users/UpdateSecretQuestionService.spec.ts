import sinon from 'sinon';
import UpdateSecretQuestionService from 'src/core/users/services/users/UpdateSecretQuestionService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import StateMachine from 'src/domains/common/StateMachine';

describe('Core :: Users :: Services :: UpdateSecretQuestionService', () => {
    let updateSecretQuestionService: UpdateSecretQuestionService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance,
        payload: any;

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
        context('When update an user secret question with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                user.inProgress.status =
                    stateMachine.props.status.WAIT_TO_UPDATE_SECRET_QUESTION;

                usersRepository = {
                    findOne: sinon.spy(() => user),
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                };

                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };

                updateSecretQuestionService = new UpdateSecretQuestionService({
                    usersDetailsRepository,
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userUpdated = await updateSecretQuestionService.update({
                    userId: '123',
                    payload,
                });

                expect(usersRepository.findOne).to.have.been.called();
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(userUpdated.userDetails.secretQuestion).to.be.deep.equal(payload);
            });
        });

        context('When update an user secret question fail ', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                user.inProgress.status =
                    stateMachine.props.status.WAIT_TO_UPDATE_SECRET_QUESTION;
                userDetails.secretQuestion = null;

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                    update: sinon.spy(() => ({})),
                };

                payload = {
                    question: 'newQuestion',
                    answer: 'newAnswer',
                };

                updateSecretQuestionService = new UpdateSecretQuestionService({
                    usersDetailsRepository,
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should throw an error if new question is wrong - new-structure-secret-question-missing', async () => {
                payload = {};
                try {
                    await updateSecretQuestionService.update({
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
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                payload = {
                    new: {
                        question: 'newQuestion',
                        answer: 'newAnswer',
                    },
                };

                userDetails.secretQuestion = payload.new;

                usersDetailsRepository = {
                    update: sinon.spy(() => userDetails),
                };

                updateSecretQuestionService = new UpdateSecretQuestionService({
                    usersDetailsRepository,
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                await updateSecretQuestionService.save({ user, userDetails });
                expect(usersRepository.update).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.called();
            });
        });
    });
});
