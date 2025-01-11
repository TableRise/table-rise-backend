import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import {
    CheckCharactersPayload,
    UpdateMatchPlayersPayload,
} from 'src/types/api/campaigns/http/payload';
import { UpdateMatchPlayersResponse } from 'src/types/api/users/methods';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchPlayersService {
    private readonly _campaignsRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['updateMatchPlayersServiceContract']) {
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

    async updateMatchPlayers({
        campaignId,
        userId,
        characterId,
        operation,
    }: UpdateMatchPlayersPayload): Promise<UpdateMatchPlayersResponse> {
        this._logger('info', 'UpdateMatchPlayers - UpdateMatchPlayersService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });
        const userDetails = await this._usersDetailsRepository.findOne({ userId });
        const dungeonMaster = campaign.campaignPlayers.find(
            (player) => player.role === 'dungeon_master'
        );

        if (dungeonMaster?.userId === userId)
            HttpRequestErrors.throwError('player-master-equal');

        if (operation === 'add') {
            const playerAlreadyInMatch = campaign.campaignPlayers.find(
                (player) => player.userId === userId
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
        }

        if (operation === 'remove') {
            userDetails.gameInfo.campaigns = userDetails.gameInfo.campaigns.filter(
                (id) => id !== campaignId
            );

            campaign.campaignPlayers = campaign.campaignPlayers.filter(
                (player) => player.userId !== userId
            );
        }

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
