import Discord from 'passport-discord';
import Google from 'passport-google-oauth20';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import newUUID from 'src/domains/common/helpers/newUUID';
import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import {
    __FullUser,
    __TokenObject,
    __UserEnriched,
    __UserSaved,
    __UserSerialized,
} from 'src/types/api/users/methods';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

export default class OAuthService {
    private readonly _usersRepository;
    private readonly _userDetailsRepository;
    private readonly _serializer;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        serializer,
        logger,
    }: OAuthCoreDependencies['oAuthServiceContract']) {
        this._usersRepository = usersRepository;
        this._userDetailsRepository = usersDetailsRepository;
        this._serializer = serializer;
        this._logger = logger;

        this.login = this.login.bind(this);
        this.serialize = this.serialize.bind(this);
        this.enrichment = this.enrichment.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    public login(userInDb: UserInstance, userSerialized: UserInstance): __TokenObject {
        this._logger('info', 'Login - OAuthService');
        const isProviderIdValid = userInDb.providerId === userSerialized.providerId;

        if (!isProviderIdValid)
            HttpRequestErrors.throwError('email-already-exist', '/register');

        return { token: JWTGenerator.generate(userInDb) };
    }

    public async serialize(
        payload: Google.Profile | Discord.Profile
    ): Promise<__UserSerialized> {
        this._logger('info', 'Serialize - OAuthService');
        const userExternalSerialized = this._serializer.externalUser(payload);

        const userSerialized = this._serializer.postUser(userExternalSerialized);
        const userDetailsSerialized = this._serializer.postUserDetails({});

        return { userSerialized, userDetailsSerialized };
    }

    public async enrichment(
        { user, userDetails }: __FullUser,
        provider: string
    ): Promise<__UserEnriched> {
        this._logger('info', 'Enrichment - CreateUserService');
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = 'oauth';
        user.twoFactorSecret = { active: false };
        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_COMPLETE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusMustBe: InProgressStatusEnum.enum.WAIT_TO_COMPLETE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        userDetails.secretQuestion = { question: 'oauth', answer: provider };

        return {
            userEnriched: user,
            userDetailsEnriched: userDetails,
        };
    }

    public async saveUser({ user, userDetails }: __FullUser): Promise<__UserSaved> {
        this._logger('info', 'SaveUser - CreateUserService');
        const userSaved = await this._usersRepository.create({
            ...user,
            userId: newUUID(),
        });

        const userDetailsSaved = await this._userDetailsRepository.create({
            ...userDetails,
            userId: userSaved.userId,
            userDetailId: newUUID(),
        });

        this._logger('info', 'User saved on database');
        this._logger('info', 'User details saved on database');

        return { userSaved, userDetailsSaved };
    }
}
