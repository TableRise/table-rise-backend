import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';
import { __FullUser } from 'src/types/api/users/methods';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class ActivateTwoFactorService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _twoFactorHandler;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        twoFactorHandler,
        logger,
    }: UserCoreDependencies['activateTwoFactorServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._twoFactorHandler = twoFactorHandler;
        this._logger = logger;

        this.activate = this.activate.bind(this);
        this.save = this.save.bind(this);
    }

    public async activate(userId: string, isReset: boolean = false): Promise<__FullUser> {
        this._logger('info', 'Activate - ActivateTwoFactorService');
        const { status, flows } = this._stateMachine.props;

        const userInDb = await this._usersRepository.findOne({ userId });

        if (userInDb.inProgress.status !== status.WAIT_TO_ACTIVATE_TWO_FACTOR)
            HttpRequestErrors.throwError('invalid-user-status');
        if (userInDb.twoFactorSecret.active)
            HttpRequestErrors.throwError('2fa-already-active');

        userInDb.twoFactorSecret = await this._twoFactorHandler.create(userInDb.email);

        const userDetailInDb = await this._usersDetailsRepository.findOne({
            userId: userInDb.userId,
        });

        userDetailInDb.secretQuestion = null;

        await this._stateMachine.machine(flows.ACTIVATE_TWO_FACTOR, userInDb);

        return { user: userInDb, userDetails: userDetailInDb };
    }

    public async save({ user, userDetails }: __FullUser): Promise<TwoFactorResponse> {
        this._logger('info', 'Save - ActivateTwoFactorService');

        const userSaved = await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        await this._usersDetailsRepository.update({
            query: { userId: userSaved.userId },
            payload: userDetails,
        });

        delete user.twoFactorSecret.secret;
        return user.twoFactorSecret as TwoFactorResponse;
    }
}
