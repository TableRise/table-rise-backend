import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class ResetProfileService {
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        stateMachine,
        usersRepository,
        logger,
    }: UserCoreDependencies['resetProfileServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this.reset = this.reset.bind(this);
    }

    public async reset(userId: string): Promise<void> {
        this._logger('info', 'Reset - ResetProfileService');
        const { status, flows } = this._stateMachine.props;

        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        if (userInDb.inProgress.status !== status.WAIT_TO_RESET_PROFILE)
            HttpRequestErrors.throwError('invalid-user-status');

        userDetailInDb.gameInfo.badges = [];
        userDetailInDb.gameInfo.campaigns = [];
        userDetailInDb.gameInfo.characters = [];

        await this._stateMachine.machine(flows.RESET_PROFILE, userInDb);

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }
}
