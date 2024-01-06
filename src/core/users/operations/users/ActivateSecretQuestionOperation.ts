import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { ActivateSecretQuestionPayload } from 'src/types/api/users/http/payload';

export default class ActivateSecretQuestionOperation {
    private readonly _activateSecretQuestionService;
    private readonly _logger;

    constructor({
        activateSecretQuestionService,
        logger,
    }: UserCoreDependencies['activateSecretQuestionOperationContract']) {
        this._activateSecretQuestionService = activateSecretQuestionService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        { userId, payload }: ActivateSecretQuestionPayload,
        isUpdate: boolean
    ): Promise<void> {
        this._logger('info', 'Execute - ActivateSecretQuestionOperation');

        const { user, userDetails } = await this._activateSecretQuestionService.activate(
            {
                userId,
                payload,
            },
            isUpdate
        );

        await this._activateSecretQuestionService.save({ user, userDetails });
    }
}
