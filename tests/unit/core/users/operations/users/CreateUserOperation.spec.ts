import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import CreateUserOperation from 'src/core/users/operations/users/CreateUserOperation';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Operations :: CreateUserOperation', () => {
    let createUserOperation: CreateUserOperation,
        usersSchema: any,
        schemaValidator: any,
        createUserService: any,
        userToCreate: any,
        userCreated: any;

    const logger = (): void => {};

    context('When a new user is created with success', () => {
        before(() => {
            usersSchema = {
                userZod: {},
                userDetailZod: {},
            };

            schemaValidator = { entry: sinon.spy(() => {}) };

            userToCreate = DomainDataFaker.generateUsersJSON()[0];
            userCreated = {
                ...userToCreate,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            createUserService = {
                serialize: sinon.spy(() => ({
                    userSerialized: {},
                    userDetailsSerialized: {},
                })),
                enrichment: sinon.spy(() => ({
                    userEnriched: {},
                    userDetailsEnriched: {},
                })),
                save: sinon.spy(() => ({
                    userSaved: userToCreate,
                    userDetailsSaved: userCreated.details,
                })),
            };

            createUserOperation = new CreateUserOperation({
                usersSchema,
                schemaValidator,
                createUserService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await createUserOperation.execute(userCreated);

            expect(schemaValidator.entry).to.have.been.called(2);
            expect(createUserService.serialize).to.have.been.called();
            expect(createUserService.enrichment).to.have.been.calledWith({
                user: {},
                userDetails: {},
            });
            expect(createUserService.save).to.have.been.calledWith({
                user: {},
                userDetails: {},
            });
            expect(userTest).to.be.deep.equal(userCreated);
        });
    });

    context('When a new user creation fails', () => {
        before(() => {
            usersSchema = {
                userZod: {},
                userDetailZod: {},
            };

            schemaValidator = { entry: sinon.stub() };

            schemaValidator.entry.callsFake(() => {
                throw new HttpRequestErrors({
                    message: 'Schema error',
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    details: [
                        {
                            attribute: 'nickname',
                            path: 'payload',
                            reason: 'Required',
                        },
                    ],
                });
            });

            userCreated = {
                ...DomainDataFaker.generateUsersJSON()[0],
            };

            createUserService = {
                serialize: sinon.spy(() => ({
                    userSerialized: {},
                    userDetailsSerialized: {},
                })),
                enrichment: sinon.spy(() => ({
                    userEnriched: {},
                    userDetailsEnriched: {},
                })),
                save: sinon.spy(() => userCreated),
            };

            createUserOperation = new CreateUserOperation({
                usersSchema,
                schemaValidator,
                createUserService,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await createUserOperation.execute(userCreated);
                expect('it should not be here').to.be.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');
                expect(err.details[0].attribute).to.be.equal('nickname');
                expect(err.details[0].reason).to.be.equal('Required');
            }
        });
    });
});
