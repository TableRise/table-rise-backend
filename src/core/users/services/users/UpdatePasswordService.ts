import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdatePasswordPayload } from 'src/types/api/users/http/payload';
import { UserPassword } from 'src/types/modules/core/users/users/UpdatePassword';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class UpdatePasswordService {
    private readonly _usersRepository;
    private readonly _stateMachine;
    private readonly _logger;

    constructor({
        usersRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['updatePasswordServiceContract']) {
        this._usersRepository = usersRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;
    }

    private async _changePassword({
        user,
        password,
    }: UserPassword): Promise<UserInstance> {
        this._logger('info', 'ChangePassword - UpdatePasswordService');
        const { flows } = this._stateMachine.props;

        user.password = await SecurePasswordHandler.hashPassword(password);

        await this._stateMachine.machine(flows.UPDATE_PASSWORD, user);

        return user;
    }

    public async update({ email, password }: UpdatePasswordPayload): Promise<void> {
        this._logger('info', 'Update - UpdatePasswordService');
        const { status } = this._stateMachine.props;

        const userInDb = await this._usersRepository.findOne({ email });

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_PASSWORD_CHANGE)
            HttpRequestErrors.throwError('invalid-user-status');

        const passwordChanged = await this._changePassword({ user: userInDb, password });

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: passwordChanged,
        });
    }
}
