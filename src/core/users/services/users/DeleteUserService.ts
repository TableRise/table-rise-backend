import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class DeleteUserService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['deleteUserServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this.delete = this.delete.bind(this);
    }

    public async delete(userId: string): Promise<void> {
        this._logger('info', `Delete - DeleteUserService - ReceivedID is ${userId}`);
        const { status, flows } = this._stateMachine.props;

        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userInDb || !userDetailInDb) HttpRequestErrors.throwError('user-inexistent');
        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_DELETE_USER)
            HttpRequestErrors.throwError('invalid-user-status');
        if (
            userDetailInDb.gameInfo.campaigns.length ||
            userDetailInDb.gameInfo.characters.length
        ) {
            HttpRequestErrors.throwError('linked-mandatory-data-when-delete');
        }

        await this._stateMachine.machine(flows.DELETE_PROFILE, userInDb);

        const userUpdated = await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });

        this._logger(
            'info',
            `Delete Service - User waiting to be deleted from database with ID ${userUpdated.userId} and status ${userUpdated.inProgress.status}`
        );
    }
}
