import getErrorName from 'src/domains/common/helpers/getErrorName';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import CompleteUserService from 'src/core/users/services/oauth/CompleteUserService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import Sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

describe('Core :: Users :: Operations :: OAuth :: CompleteUserService', () => {
    let completeUserService: CompleteUserService,
        user: UserInstance,
        userDetails: UserDetailInstance,
        usersRepository: any,
        usersDetailsRepository: any,
        payloadToCompleteUser: any;

    const logger = (): void => {};

    context('#process', () => {
        context('When a user is processed to be completed', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                const { nickname, ...userWithoutNickname } = user;
                const { firstName, lastName, pronoun, birthday, ...detailsEmpty } =
                    userDetails;

                payloadToCompleteUser = {
                    nickname,
                    firstName,
                    lastName,
                    pronoun,
                    birthday,
                };

                user = userWithoutNickname as UserInstance;
                userDetails = detailsEmpty as UserDetailInstance;
                user.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_COMPLETE;

                usersRepository = {
                    find: Sinon.spy(() => []),
                };

                usersDetailsRepository = {};

                completeUserService = new CompleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should have the correct returns', async () => {
                const userProcessed = await completeUserService.process(
                    { user, userDetails },
                    payloadToCompleteUser
                );

                expect(userProcessed).to.have.property('user');
                expect(userProcessed).to.have.property('userDetails');
                expect(userProcessed.user.nickname).to.be.equal(
                    payloadToCompleteUser.nickname
                );
                expect(userProcessed.userDetails.firstName).to.be.equal(
                    payloadToCompleteUser.firstName
                );
                expect(userProcessed.userDetails.lastName).to.be.equal(
                    payloadToCompleteUser.lastName
                );
                expect(userProcessed.userDetails.pronoun).to.be.equal(
                    payloadToCompleteUser.pronoun
                );
                expect(userProcessed.userDetails.birthday).to.be.equal(
                    payloadToCompleteUser.birthday
                );
            });
        });

        context(
            'When a user is processed to be completed - but nickname tag already exists',
            () => {
                before(() => {
                    user = DomainDataFaker.generateUsersJSON()[0];
                    userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                    const { nickname } = user;
                    const { firstName, lastName, pronoun, birthday, ...detailsEmpty } =
                        userDetails;

                    payloadToCompleteUser = {
                        nickname,
                        firstName,
                        lastName,
                        pronoun,
                        birthday,
                    };

                    userDetails = detailsEmpty as UserDetailInstance;
                    user.tag = '#4511';
                    user.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_COMPLETE;

                    usersRepository = {
                        find: Sinon.spy(() => [user]),
                    };

                    usersDetailsRepository = {};

                    completeUserService = new CompleteUserService({
                        usersRepository,
                        usersDetailsRepository,
                        logger,
                    });
                });

                it('should throw correct error', async () => {
                    try {
                        await completeUserService.process(
                            { user, userDetails },
                            payloadToCompleteUser
                        );
                        expect('it should not be here').to.be.equal(false);
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal(
                            'User with this tag already exists in database'
                        );
                        expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                        expect(err.name).to.be.equal(
                            getErrorName(HttpStatusCode.BAD_REQUEST)
                        );
                    }
                });
            }
        );
    });

    context('#save', () => {
        context('When a user processed is saved', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                user.inProgress.status = InProgressStatusEnum.enum.DONE;

                usersRepository = {
                    update: Sinon.spy(() => user),
                };

                usersDetailsRepository = {
                    update: Sinon.spy(() => userDetails),
                };

                completeUserService = new CompleteUserService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should have the correct returns', async () => {
                const userProcessed = await completeUserService.save({
                    userId: user.userId,
                    user,
                    userDetails,
                });
                expect(userProcessed).to.have.property('details');
                expect(userProcessed.nickname).to.be.equal(user.nickname);
                expect(userProcessed.details).to.be.deep.equal(userDetails);
            });
        });
    });
});
