import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GetByIdPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

export default class GetUserByIdService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['getUserByIdServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get({ userId }: GetByIdPayload): Promise<RegisterUserResponse> {
        this._logger('info', 'Get - GetUserByIdService');
        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        if (userInDb.inProgress.status === InProgressStatusEnum.enum.WAIT_TO_DELETE_USER)
            HttpRequestErrors.throwError('user-inexistent');

        return {
            ...userInDb,
            details: userDetailInDb,
        };
    }
}
