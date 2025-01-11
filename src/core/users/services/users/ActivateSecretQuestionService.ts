import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { ActivateSecretQuestionPayload } from 'src/types/api/users/http/payload';
import {
    ActivateSecretQuestionResponse,
    CompleteUserResponse,
} from 'src/types/api/users/http/response';

export default class ActivateSecretQuestionService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        usersRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['activateSecretQuestionServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this.activate = this.activate.bind(this);
        this.save = this.save.bind(this);
    }

    public async activate({
        userId,
        payload,
    }: ActivateSecretQuestionPayload): Promise<CompleteUserResponse> {
        this._logger('info', 'Activate - ActivateSecretQuestionService');
        const { status, flows } = this._stateMachine.props;

        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');
        if (userInDb.inProgress.status !== status.WAIT_TO_ACTIVATE_SECRET_QUESTION)
            HttpRequestErrors.throwError('invalid-user-status');
        if (!payload)
            HttpRequestErrors.throwError('new-structure-secret-question-missing');

        userInDb.twoFactorSecret = { active: false };
        userDetailsInDb.secretQuestion = payload;

        await this._stateMachine.machine(flows.ACTIVATE_SECRET_QUESTION, userInDb);

        return { user: userInDb, details: userDetailsInDb };
    }

    public async save(
        payload: CompleteUserResponse
    ): Promise<ActivateSecretQuestionResponse> {
        const { user, details } = payload;

        const userInDb = await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        await this._usersDetailsRepository.update({
            query: { userId: user.userId },
            payload: details,
        });

        return { active: userInDb.twoFactorSecret.active };
    }
}
