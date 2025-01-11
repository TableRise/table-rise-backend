import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import {
    UserVerifyEmail,
    verifyEmailZodSchema,
} from 'src/domains/users/schemas/usersValidationSchema';

export default class VerifyEmailOperation {
    private readonly _logger;
    private readonly _verifyEmailService;
    private readonly _schemaValidator;

    constructor({
        verifyEmailService,
        schemaValidator,
        logger,
    }: UserCoreDependencies['verifyEmailOperationContract']) {
        this._logger = logger;
        this._verifyEmailService = verifyEmailService;
        this._schemaValidator = schemaValidator;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: UserVerifyEmail): Promise<void> {
        this._logger('info', 'Execute - VerifyEmailOperation');
        this._schemaValidator.entry(verifyEmailZodSchema, payload);
        await this._verifyEmailService.sendEmail(payload);
    }
}
