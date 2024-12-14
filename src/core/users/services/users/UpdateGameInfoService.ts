import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateGameInfoPayload } from 'src/types/api/users/http/payload';
import {
    UpdateGameInfoProcessPayload,
    UserGameInfoDoneResponse,
} from 'src/types/api/users/methods';

export default class UpdateGameInfoService {
    private readonly _logger;
    private readonly _usersDetailsRepository;

    constructor({
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['updateGameInfoServiceContract']) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this._addId = this._addId.bind(this);
        this._removeId = this._removeId.bind(this);
        this.update = this.update.bind(this);
    }

    private _addId({
        infoId,
        targetInfo,
        gameInfo,
    }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        this._logger('info', 'AddId - UpdateGameInfoService');

        const hasInfo = gameInfo[targetInfo].some((data) => data === infoId);

        hasInfo
            ? HttpRequestErrors.throwError('info-already-added')
            : gameInfo[targetInfo].push(infoId);

        return gameInfo;
    }

    private _removeId({
        infoId,
        targetInfo,
        gameInfo,
    }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        this._logger('info', 'RemoveId - UpdateGameInfoService');
        const hasInfo = gameInfo[targetInfo].filter((data) => data !== infoId);

        gameInfo[targetInfo] = hasInfo;

        return gameInfo;
    }

    public async update({
        userId,
        infoId,
        targetInfo,
        operation,
    }: UpdateGameInfoPayload): Promise<string> {
        this._logger('info', 'Update - UpdateGameInfoService');
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        let gameInfo = userDetailInDb.gameInfo;

        if (operation === 'add') gameInfo = this._addId({ infoId, targetInfo, gameInfo });
        if (operation === 'remove')
            gameInfo = this._removeId({ infoId, targetInfo, gameInfo });

        userDetailInDb.gameInfo = gameInfo;

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });

        return `ID ${infoId} ${operation} with success to ${targetInfo}`;
    }
}
