import path from 'path';
import ResetTwoFactorService from 'src/core/users/services/users/ResetTwoFactorService';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import StateMachine from 'src/domains/common/StateMachine';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';

const configs = require(path.join(process.cwd(), 'tablerise.environment.js'));

describe('Core :: Users :: Services :: ResetTwoFactorService', () => {
    let resetTwoFactorService: ResetTwoFactorService,
        usersRepository: any,
        twoFactorHandler: TwoFactorHandler,
        user: UserInstance;

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
        context('When reset an user two factor with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status =
                    stateMachine.props.status.WAIT_TO_FINISH_RESET_TWO_FACTOR;

                usersRepository = {
                    findOne: () => user,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                resetTwoFactorService = new ResetTwoFactorService({
                    usersRepository,
                    twoFactorHandler,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await resetTwoFactorService.reset('userId');
                expect(userTest).to.be.deep.equal(user);
            });
        });

        context('When reset an user two factor with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.inProgress.status =
                    stateMachine.props.status.WAIT_TO_ACTIVATE_SECRET_QUESTION;

                usersRepository = {
                    findOne: () => user,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                resetTwoFactorService = new ResetTwoFactorService({
                    usersRepository,
                    twoFactorHandler,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                try {
                    await resetTwoFactorService.reset('userId');
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

    context('#save', () => {
        context('When save an user two factor with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.twoFactorSecret.active = true;

                usersRepository = {
                    update: () => user,
                };

                twoFactorHandler = new TwoFactorHandler({ configs, logger });

                resetTwoFactorService = new ResetTwoFactorService({
                    usersRepository,
                    twoFactorHandler,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const result = await resetTwoFactorService.save(user);
                expect(result.active).to.be.equal(true);
            });
        });
    });
});
