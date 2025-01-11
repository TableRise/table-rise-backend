import GetUserByIdService from 'src/core/users/services/users/GetUserByIdService';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

describe('Core :: Users :: Services :: GetUserByIdService', () => {
    let getUserByIdService: GetUserByIdService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance,
        userReturned: RegisterUserResponse;

    const logger = (): void => {};

    context('#Get', () => {
        context('When get user by id with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userReturned = { ...user, details: userDetails };

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                getUserByIdService = new GetUserByIdService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await getUserByIdService.get({
                    userId: user.userId,
                });

                expect(userTest.details.userId).to.be.equal(userTest.userId);
                expect(userTest).to.be.deep.equal(userReturned);
            });
        });

        context('When get user by id with success - but is deleted', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userReturned = { ...user, details: userDetails };

                user.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                getUserByIdService = new GetUserByIdService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                try {
                    await getUserByIdService.get({
                        userId: user.userId,
                    });

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });
    });
});
