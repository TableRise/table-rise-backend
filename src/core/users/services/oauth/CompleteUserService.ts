import { CompleteOAuthPayload } from 'src/domains/users/schemas/oAuthValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import { __UserWithID, __FullUser } from 'src/types/api/users/methods';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

export default class CompleteUserService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: OAuthCoreDependencies['completeUserServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.process = this.process.bind(this);
        this.save = this.save.bind(this);
    }

    public async process(
        { user, userDetails }: __FullUser,
        payload: CompleteOAuthPayload
    ): Promise<__FullUser> {
        this._logger('info', 'Process - CompleteUserService');
        user.nickname = payload.nickname;

        const nicknameExists = await this._usersRepository.find({
            nickname: user.nickname,
            tag: user.tag,
        });

        if (nicknameExists.length) HttpRequestErrors.throwError('tag-already-exist');

        user.inProgress.status = InProgressStatusEnum.enum.DONE;
        userDetails.firstName = payload.firstName;
        userDetails.lastName = payload.lastName;
        userDetails.pronoun = payload.pronoun;
        userDetails.birthday = payload.birthday;

        return { user, userDetails };
    }

    public async save({
        userId,
        user,
        userDetails,
    }: __UserWithID): Promise<RegisterUserResponse> {
        this._logger('info', 'Save - CompleteUserService');
        const userUpdated = await this._usersRepository.update({
            query: { userId },
            payload: user,
        });

        const userDetailsUpdated = await this._usersDetailsRepository.update({
            query: { userId },
            payload: userDetails,
        });

        return {
            ...userUpdated,
            details: userDetailsUpdated,
        };
    }
}
