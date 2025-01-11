import sinon from 'sinon';
import deleteUserCronJob from 'src/domains/users/helpers/crons/deleteUserCronJob';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import * as daysDifference from 'src/domains/common/helpers/daysDifference';
import cron from 'node-cron';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

const ONE_MINUTE_TICK = 60000;
const WAIT_TO_EXCLUSION_PERIOD = 15;

describe('Domains :: Users :: Helpers :: Crons :: DeleteuserConJob', () => {
    context('When called', () => {
        let clock: any,
            cronScheduleSpy: any,
            daysDifferenceSpy: any,
            scheduleTime: string,
            user: UserInstance,
            userDetails: UserDetailInstance,
            userDetailsToExclude: UserDetailInstance,
            users: UserInstance[],
            usersDetailsRepository: any,
            usersRepository: any,
            userToExclude: UserInstance;

        context(
            'should delete users with more than 15 days with status wait_to_delete',
            () => {
                before(() => {
                    user = DomainDataFaker.generateUsersJSON()[0];
                    user.updatedAt = new Date().toISOString();
                    user.inProgress.status =
                        InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;
                    userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                    userToExclude = DomainDataFaker.generateUsersJSON()[0];
                    userDetailsToExclude = DomainDataFaker.generateUserDetailsJSON()[0];
                    userDetailsToExclude.userId = userToExclude.userId;
                    userToExclude.inProgress.status =
                        InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;
                    userToExclude.updatedAt = new Date('2023-05-10').toISOString();

                    users = [user, userToExclude];
                    usersRepository = {
                        find: () => users,
                        delete: sinon.spy(() => [user]),
                    };
                    usersDetailsRepository = { delete: sinon.spy(() => [userDetails]) };

                    clock = sinon.useFakeTimers(new Date().setHours(0, 0, 0, 0));

                    daysDifferenceSpy = sinon.spy(daysDifference, 'default');
                    cronScheduleSpy = sinon.spy(cron, 'schedule');
                    scheduleTime = '1 0 * * *';
                });

                after(() => {
                    sinon.restore();
                });

                it('should return the correct result', async () => {
                    const deleUserScheduledTaskTest = await deleteUserCronJob(
                        usersRepository,
                        usersDetailsRepository
                    );
                    deleUserScheduledTaskTest.start();
                    expect(cronScheduleSpy).to.have.been.called();
                    expect(cronScheduleSpy).to.have.been.calledWith(scheduleTime);

                    await clock.tickAsync(ONE_MINUTE_TICK);

                    expect(daysDifferenceSpy).to.have.been.calledTwice();
                    expect(daysDifferenceSpy).returned(true);
                    expect(daysDifferenceSpy).returned(false);
                    expect(daysDifferenceSpy).to.have.been.calledWith(
                        Date.parse(userToExclude.updatedAt),
                        WAIT_TO_EXCLUSION_PERIOD
                    );
                    expect(daysDifferenceSpy).to.have.been.calledWith(
                        Date.parse(user.updatedAt),
                        WAIT_TO_EXCLUSION_PERIOD
                    );

                    expect(usersRepository.delete).to.have.been.calledWith({
                        userId: userToExclude.userId,
                    });
                    expect(usersDetailsRepository.delete).to.have.been.calledWith({
                        userId: userDetailsToExclude.userId,
                    });
                });
            }
        );
    });
});
