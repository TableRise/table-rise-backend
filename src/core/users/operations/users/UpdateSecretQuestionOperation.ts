import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateSecretQuestionPayload } from 'src/types/api/users/http/payload';

export default class UpdateSecretQuestionOperation {
    private readonly _updateSecretQuestionService;
    private readonly _logger;

    constructor({
        updateSecretQuestionService,
        logger,
    }: UserCoreDependencies['updateSecretQuestionOperationContract']) {
        this._updateSecretQuestionService = updateSecretQuestionService;
        this._logger = logger;
    }

    public async execute({
        userId,
        payload,
    }: UpdateSecretQuestionPayload): Promise<void> {
        this._logger('info', 'Execute - UpdateSecretQuestionOperation');
        const userDetailsInDb = await this._updateSecretQuestionService.update({
            userId,
            payload,
        });

        await this._updateSecretQuestionService.save(userDetailsInDb);
    }
}
