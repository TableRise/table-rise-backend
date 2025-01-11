import sinon from 'sinon';
import UpdatePasswordService from 'src/core/users/services/users/UpdatePasswordService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import StateMachine from 'src/domains/common/StateMachine';

describe('Core :: Users :: Services :: UpdatePasswordService', () => {
    let updatePasswordService: UpdatePasswordService,
        usersRepository: any,
        user: UserInstance,
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
        context('When update an user password with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.inProgress.status =
                    InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE;
                user.inProgress.code = '123456';

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => ({})),
                };

                payload = {
                    email: 'user@email.com',
                    code: '123456',
                    password: 'World#123',
                };

                updatePasswordService = new UpdatePasswordService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                await updatePasswordService.update(payload);

                expect(usersRepository.update).to.have.been.called();
            });
        });

        context('When update an user password fail - invalid status', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                };

                payload = {
                    email: 'user@email.com',
                    code: '123456',
                    password: 'World#123',
                };

                updatePasswordService = new UpdatePasswordService({
                    usersRepository,
                    stateMachine,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updatePasswordService.update(payload);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'User status is invalid to perform this operation'
                    );
                    expect(err.name).to.be.equal('BadRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });
});
