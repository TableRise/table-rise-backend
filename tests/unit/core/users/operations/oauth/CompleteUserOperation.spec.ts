/* eslint-disable @typescript-eslint/no-unused-vars */
import sinon from 'sinon';
import CompleteUserOperation from 'src/core/users/operations/oauth/CompleteUserOperation';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Operations :: OAuth', () => {
    let completeUserOperation: CompleteUserOperation,
        schemaValidator: any,
        usersSchema: any,
        completeUserService: any,
        user: UserInstance,
        userNotCompleted: UserInstance,
        userDetails: UserDetailInstance,
        userDetailsNotCompleted: any,
        payload: any,
        getUserByIdService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When an oauth user is completed', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                usersSchema = {
                    oAuthComplete: {},
                };

                schemaValidator = {
                    entry: sinon.spy(),
                };

                const { firstName, lastName, pronoun, birthday, ...detailsEmpty } =
                    userDetails;

                payload = { firstName, lastName, pronoun, birthday };

                user.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_COMPLETE;

                userNotCompleted = user;
                userDetailsNotCompleted = detailsEmpty;

                getUserByIdService = {
                    get: sinon.spy(() => ({
                        ...userNotCompleted,
                        details: userDetailsNotCompleted,
                    })),
                };

                user.inProgress.status = InProgressStatusEnum.enum.DONE;

                userDetails = { ...userDetails, firstName, lastName, pronoun, birthday };

                completeUserService = {
                    process: sinon.spy(() => ({
                        user,
                        userDetails,
                    })),
                    save: sinon.spy(() => ({
                        user,
                        details: userDetails,
                    })),
                };

                completeUserOperation = new CompleteUserOperation({
                    schemaValidator,
                    usersSchema,
                    completeUserService,
                    getUserByIdService,
                    logger,
                });
            });

            it('should call correct methods and have correct return', async () => {
                const userCompleted = await completeUserOperation.execute({
                    userId: user.userId,
                    payload,
                });

                expect(schemaValidator.entry).to.have.been.calledWith(
                    usersSchema.oAuthComplete,
                    payload
                );
                expect(getUserByIdService.get).to.have.been.calledWith({
                    userId: user.userId,
                });
                expect(completeUserService.process).to.have.been.calledWith({
                    user: userNotCompleted,
                    userDetails: userDetailsNotCompleted,
                });
                expect(completeUserService.save).to.have.been.calledWith({
                    userId: user.userId,
                    user,
                    userDetails,
                });
                expect(userCompleted).to.be.deep.equal({ user, details: userDetails });
            });
        });
    });
});
