import GetUsersService from 'src/core/users/services/users/GetUsersService';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: GetUsersService', () => {
    let getUsersService: GetUsersService,
        usersRepository: any,
        usersDetailsRepository: any,
        users: UserInstance[],
        usersDetails: UserDetailInstance[],
        allUsersWithDetails: any;

    const logger = (): void => {};

    context('#Get', () => {
        context('When get all users with success', () => {
            before(() => {
                users = DomainDataFaker.generateUsersJSON();
                usersDetails = DomainDataFaker.generateUserDetailsJSON();

                usersDetails.forEach(
                    (userDet: any, i: number) => (userDet.userId = users[i].userId)
                );

                allUsersWithDetails = users.map((user: any, i: number) => ({
                    ...user,
                    details: usersDetails.find((det) => det.userId === user.userId),
                }));

                usersRepository = {
                    find: () => users,
                };

                usersDetailsRepository = {
                    find: () => usersDetails,
                };

                getUsersService = new GetUsersService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const allUsers = await getUsersService.get();

                expect(allUsers[0].email).to.be.equal(allUsersWithDetails[0].email);
                expect(allUsers[0].details.firstName).to.be.equal(
                    allUsersWithDetails[0].details.firstName
                );
                expect(allUsers[1].email).to.be.equal(allUsersWithDetails[1].email);
                expect(allUsers[1].details.firstName).to.be.equal(
                    allUsersWithDetails[1].details.firstName
                );
            });
        });
    });
});
