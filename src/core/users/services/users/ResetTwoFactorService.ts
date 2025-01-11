import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class ResetTwoFactorService {
    private readonly _usersRepository;
    private readonly _twoFactorHandler;
    private readonly _stateMachine;
    private readonly _logger;

    constructor({
        usersRepository,
        twoFactorHandler,
        stateMachine,
        logger,
    }: UserCoreDependencies['resetTwoFactorServiceContract']) {
        this._usersRepository = usersRepository;
        this._twoFactorHandler = twoFactorHandler;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this.reset = this.reset.bind(this);
        this.save = this.save.bind(this);
    }

    public async reset(userId: string): Promise<UserInstance> {
        this._logger('info', 'Reset - ResetTwoFactorService');
        const { status, flows } = this._stateMachine.props;
        const userInDb = await this._usersRepository.findOne({ userId });

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_RESET_TWO_FACTOR)
            HttpRequestErrors.throwError('invalid-user-status');

        userInDb.twoFactorSecret = await this._twoFactorHandler.create(userInDb.email);

        await this._stateMachine.machine(flows.RESET_TWO_FACTOR, userInDb);

        return userInDb;
    }

    public async save(user: UserInstance): Promise<TwoFactorResponse> {
        this._logger('info', 'Save - ResetTwoFactorService');

        await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        delete user.twoFactorSecret.secret;
        return user.twoFactorSecret as TwoFactorResponse;
    }
}
