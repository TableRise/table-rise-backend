import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import { UserPayload } from 'src/domains/users/schemas/usersValidationSchema';

export default class CreateUserOperation {
    private readonly _usersSchema;
    private readonly _schemaValidator;
    private readonly _createUserService;
    private readonly _logger;

    constructor({
        usersSchema,
        schemaValidator,
        createUserService,
        logger,
    }: UserCoreDependencies['createUserOperationContract']) {
        this._usersSchema = usersSchema;
        this._schemaValidator = schemaValidator;
        this._createUserService = createUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: UserPayload): Promise<RegisterUserResponse> {
        this._logger('info', 'Execute - CreateUserOperation');
        this._schemaValidator.entry(this._usersSchema.userZod, payload);

        const entitySerialized = await this._createUserService.serialize(payload);

        const entityEnriched = await this._createUserService.enrichment({
            user: entitySerialized.userSerialized,
            userDetails: entitySerialized.userDetailsSerialized,
        });

        const entitySaved = await this._createUserService.save({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        return {
            ...entitySaved.userSaved,
            details: entitySaved.userDetailsSaved,
        };
    }
}
