import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CreateUserService from 'src/core/users/services/users/CreateUserService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('Core :: Users :: Services :: CreateUserService', () => {
    let createUserService: CreateUserService,
        serializer: any,
        usersRepository: any,
        usersDetailsRepository: any,
        emailSender: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#Serialize', () => {
        context('When serialize with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                serializer = {
                    postUser: () => user,
                    postUserDetails: () => userDetails,
                };

                usersRepository = {
                    find: () => [],
                };

                usersDetailsRepository = {};
                emailSender = {};

                createUserService = new CreateUserService({
                    serializer,
                    usersRepository,
                    usersDetailsRepository,
                    emailSender,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userPayload = {
                    ...user,
                    details: userDetails,
                };

                const { userSerialized, userDetailsSerialized } =
                    await createUserService.serialize(userPayload);

                expect(userSerialized.userId).to.be.equal(user.userId);
                expect(userDetailsSerialized.firstName).to.be.equal(
                    userDetails.firstName
                );
            });
        });

        context('When serialize with fails', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                const { nickname, ...userWithoutNickname } = user;
                const { lastName, ...userDetailsWithoutNickname } = userDetails;
                user = userWithoutNickname as UserInstance;
                userDetails = userDetailsWithoutNickname as UserDetailInstance;

                serializer = {
                    postUser: () => user,
                    postUserDetails: () => userDetails,
                };

                usersRepository = {
                    find: () => [user],
                };

                usersDetailsRepository = {};
                emailSender = {};

                createUserService = new CreateUserService({
                    serializer,
                    usersRepository,
                    usersDetailsRepository,
                    emailSender,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    const userPayload = {
                        ...user,
                        details: userDetails,
                    };

                    await createUserService.serialize(userPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Email already exists in database');
                    expect(err.name).to.be.equal('BadRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });

    context('#Enriched', () => {
        context('When enrich with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                user.tag = null as unknown as string;
                user.createdAt = null as unknown as string;
                user.updatedAt = null as unknown as string;
                user.password = 'testepwd@';
                user.inProgress = {
                    status: InProgressStatusEnum.enum.DONE,
                    currentFlow: stateFlowsEnum.enum.CREATE_USER,
                    prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                    code: '',
                };
                userDetails.secretQuestion = { question: 'testQ', answer: 'testR' };
                user.twoFactorSecret = { active: true };

                serializer = {};

                usersRepository = {
                    find: () => [],
                };

                usersDetailsRepository = {};
                emailSender = {};

                createUserService = new CreateUserService({
                    serializer,
                    usersRepository,
                    usersDetailsRepository,
                    emailSender,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const { userEnriched, userDetailsEnriched } =
                    await createUserService.enrichment({
                        user,
                        userDetails,
                    });

                expect(userEnriched.tag).to.be.not.null();
                expect(userEnriched.createdAt).to.be.not.null();
                expect(userEnriched.updatedAt).to.be.not.null();
                expect(userEnriched.password).to.be.not.equal('testepwd@');
                expect(userEnriched.twoFactorSecret.active).to.be.equal(false);
                expect(userDetailsEnriched.secretQuestion).to.be.deep.equal(
                    userDetails.secretQuestion
                );
            });
        });

        context('When enrich with fails - tag already exists', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                user.tag = null as unknown as string;
                user.createdAt = null as unknown as string;
                user.updatedAt = null as unknown as string;
                user.password = 'testepwd@';
                user.inProgress = {
                    status: InProgressStatusEnum.enum.DONE,
                    currentFlow: stateFlowsEnum.enum.CREATE_USER,
                    prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                    code: '',
                };
                userDetails.secretQuestion = { question: 'testQ', answer: 'testR' };

                serializer = {};

                usersRepository = {
                    find: () => [user],
                };

                usersDetailsRepository = {};
                emailSender = {};

                createUserService = new CreateUserService({
                    serializer,
                    usersRepository,
                    usersDetailsRepository,
                    emailSender,
                    logger,
                });
            });

            it('should throw an error', async () => {
                try {
                    await createUserService.enrichment({ user, userDetails });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'User with this tag already exists in database'
                    );
                    expect(err.name).to.be.equal('BadRequest');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });
    });

    context('#Save', () => {
        context('When save with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                serializer = {};

                usersRepository = {
                    create: () => user,
                    update: () => {},
                };

                usersDetailsRepository = {
                    create: () => userDetails,
                };

                emailSender = {
                    send: () => ({ success: true, verificationCode: 'LOKI74' }),
                };

                createUserService = new CreateUserService({
                    serializer,
                    usersRepository,
                    usersDetailsRepository,
                    emailSender,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const { userSaved, userDetailsSaved } = await createUserService.save({
                    user,
                    userDetails,
                });

                expect(userSaved.inProgress.code).to.be.equal('LOKI74');
                expect(userDetailsSaved).to.be.deep.equal(userDetails);
            });
        });

        context('When save with fails', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                serializer = {};

                usersRepository = {
                    create: () => user,
                    update: () => {},
                };

                usersDetailsRepository = {
                    create: () => userDetails,
                };

                emailSender = {
                    send: () => ({ success: false }),
                };

                createUserService = new CreateUserService({
                    serializer,
                    usersRepository,
                    usersDetailsRepository,
                    emailSender,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                try {
                    await createUserService.save({ user, userDetails });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Some problem ocurred in email sending'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.EXTERNAL_ERROR)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.EXTERNAL_ERROR);
                }
            });
        });
    });
});
