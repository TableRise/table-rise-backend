import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import Discord from 'passport-discord';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { __TokenObject } from 'src/types/api/users/methods';

export default class DiscordOperation {
    private readonly _oAuthService;
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        oAuthService,
        usersRepository,
        logger,
    }: OAuthCoreDependencies['oAuthOperationContract']) {
        this._oAuthService = oAuthService;
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        payload: Discord.Profile
    ): Promise<RegisterUserResponse | __TokenObject> {
        this._logger('info', 'Execute - DiscordOperation');

        const entitySerialized = await this._oAuthService.serialize(payload);

        const user = await this._usersRepository.find({
            email: entitySerialized.userSerialized.email,
        });

        if (!user.length)
            return this._createUser(
                entitySerialized.userSerialized,
                entitySerialized.userDetailsSerialized
            );

        return this._oAuthService.login(user[0], entitySerialized.userSerialized);
    }

    private async _createUser(
        userSerialized: UserInstance,
        userDetailsSerialized: UserDetailInstance
    ): Promise<RegisterUserResponse> {
        this._logger('info', 'CreateUser - DiscordOperation');

        const entityEnriched = await this._oAuthService.enrichment(
            {
                user: userSerialized,
                userDetails: userDetailsSerialized,
            },
            'discord'
        );

        const userSaved = await this._oAuthService.saveUser({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        const { token } = this._oAuthService.login(
            userSaved.userSaved,
            userSaved.userSaved
        );

        return {
            ...userSaved.userSaved,
            details: userSaved.userDetailsSaved,
            token,
        };
    }
}
