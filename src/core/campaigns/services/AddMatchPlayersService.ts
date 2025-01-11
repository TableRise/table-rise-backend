import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import {
    CheckCharactersPayload,
    AddMatchPlayersPayload,
} from 'src/types/api/campaigns/http/payload';
import { UpdateMatchPlayersResponse } from 'src/types/api/users/methods';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddMatchPlayersService {
    private readonly _campaignsRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['addMatchPlayersServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;
    }

    private async _checkForCharacters({
        userId,
        characterId,
    }: CheckCharactersPayload): Promise<void> {
        const funcMock = (characterId: string): any =>
            userId === '555' ? null : { userId, characterId }; // Replace this when character creation be done
        const character = funcMock(characterId); // Replace this when character creation be done

        if (character?.userId !== userId)
            HttpRequestErrors.throwError('character-does-not-exist');
    }

    public async addMatchPlayers({
        campaignId,
        userId,
        characterId,
        password,
    }: AddMatchPlayersPayload): Promise<UpdateMatchPlayersResponse> {
        this._logger('info', 'AddMatchPlayers - AddMatchPlayersService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });

        const isPasswordValid = await SecurePasswordHandler.comparePassword(
            password,
            campaign.password
        );

        if (!isPasswordValid) HttpRequestErrors.throwError('unauthorized');

        const userDetails = await this._usersDetailsRepository.findOne({ userId });
        const dungeonMaster = campaign.campaignPlayers.find(
            (player: { role: string }) => player.role === 'dungeon_master'
        );

        if (dungeonMaster?.userId === userId)
            HttpRequestErrors.throwError('player-master-equal');

        const playerAlreadyInMatch = campaign.campaignPlayers.find(
            (player: { userId: string }) => player.userId === userId
        );

        if (playerAlreadyInMatch) {
            if (playerAlreadyInMatch.status === 'banned') {
                HttpRequestErrors.throwError('player-banned');
            }

            HttpRequestErrors.throwError('player-already-in-match');
        }

        await this._checkForCharacters({
            userId,
            characterId,
        } as CheckCharactersPayload);

        const player: Player = {
            userId,
            characterIds: [],
            role: 'player',
            status: 'pending',
        };

        userDetails.gameInfo.campaigns.push(campaignId);

        campaign.campaignPlayers.push(player);

        return { campaign, userDetails };
    }

    async save(
        campaign: CampaignInstance,
        userDetails: UserDetailInstance
    ): Promise<CampaignInstance> {
        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        return this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
