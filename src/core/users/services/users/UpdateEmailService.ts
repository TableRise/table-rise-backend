import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateEmailPayload } from 'src/types/api/users/http/payload';
import { UserEmail } from 'src/types/modules/core/users/users/UpdateEmail';

export default class UpdateEmailService {
    private readonly _usersRepository;
    private readonly _stateMachine;
    private readonly _logger;

    constructor({
        usersRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['updateEmailServiceContract']) {
        this._usersRepository = usersRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this.update = this.update.bind(this);
    }

    private _changeEmail({ user, email }: UserEmail): UserInstance {
        this._logger('info', 'ChangeEmail - UpdateEmailService');
        user.email = email;
        return user;
    }

    public async update({ userId, email }: UpdateEmailPayload): Promise<void> {
        this._logger('info', 'Update - UpdateEmailService');
        const { status, flows } = this._stateMachine.props;

        const userInDb = await this._usersRepository.findOne({ userId });

        const emailAlreadyExist = await this._usersRepository.find({ email });

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_EMAIL_CHANGE)
            HttpRequestErrors.throwError('invalid-user-status');
        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email-already-exist');

        const userWithEmailChanged = this._changeEmail({ user: userInDb, email });

        await this._stateMachine.machine(flows.UPDATE_EMAIL, userWithEmailChanged);

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userWithEmailChanged,
        });
    }
}
