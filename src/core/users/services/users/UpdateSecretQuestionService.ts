import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateSecretQuestionPayload } from 'src/types/api/users/http/payload';
import { __FullUser } from 'src/types/api/users/methods';

export default class UpdateSecretQuestionService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['updateSecretQuestionServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
    }

    public async update({
        userId,
        payload,
    }: UpdateSecretQuestionPayload): Promise<__FullUser> {
        this._logger('info', 'Update - UpdateSecretQuestionService');
        const { flows } = this._stateMachine.props;

        if (!payload.answer || !payload.question)
            HttpRequestErrors.throwError('new-structure-secret-question-missing');

        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        userDetailsInDb.secretQuestion = {
            question: payload.question,
            answer: payload.answer,
        };

        await this._stateMachine.machine(flows.UPDATE_SECRET_QUESTION, userInDb);

        return { user: userInDb, userDetails: userDetailsInDb };
    }

    public async save(fullUser: __FullUser): Promise<void> {
        await this._usersRepository.update({
            query: { userId: fullUser.user.userId },
            payload: fullUser.user,
        });

        await this._usersDetailsRepository.update({
            query: { userDetailId: fullUser.userDetails.userDetailId },
            payload: fullUser.userDetails,
        });
    }
}
