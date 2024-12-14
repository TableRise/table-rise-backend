import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { PostBanPlayerPayload } from 'src/types/api/campaigns/http/payload';

export default class PostBanPlayerService {
    private readonly _logger;
    private readonly _usersDetailsRepository;
    private readonly _campaignsRepository;

    constructor({
        usersDetailsRepository,
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['postBanPlayerServiceContract']) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    private _validateBanPlayer(campaign: any, playerId: string): void {
        this._logger('info', 'validateBanPlayer - PostBanPlayerService');

        const isBanned = campaign.bannedPlayers.some((data: string) => data === playerId);

        if (isBanned) {
            HttpRequestErrors.throwError('player-already-banned');
        }

        const playerInCampaign = campaign.campaignPlayers.find(
            (player: { userId: string }) => player.userId === playerId
        );

        if (!playerInCampaign) {
            HttpRequestErrors.throwError('player-not-in-match');
        }

        if (playerInCampaign.role === 'dungeon_master') {
            HttpRequestErrors.throwError('player-is-the-dungeon-master');
        }
    }

    private _updateInformation(
        campaign: any,
        playerId: string,
        campaignId: string,
        userDetailInDb: any
    ): void {
        this._logger('info', 'updateCampaignAndUser - PostBanPlayerService');

        campaign.campaignPlayers = campaign.campaignPlayers.filter(
            (player: { userId: string }) => player.userId !== playerId
        );

        campaign.bannedPlayers.push(playerId);

        userDetailInDb.gameInfo.bannedFromCampaigns.push(campaignId);
    }

    private async _saveUpdates(campaign: any, userDetailInDb: any): Promise<void> {
        this._logger('info', 'saveUpdates - PostBanPlayerService');

        await this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }

    public async banPlayer({
        campaignId,
        playerId,
    }: PostBanPlayerPayload): Promise<void> {
        this._logger('info', 'banPlayer - PostBanPlayerService');

        const campaign = await this._campaignsRepository.findOne({ campaignId });

        this._validateBanPlayer(campaign, playerId);

        const userDetailInDb = await this._usersDetailsRepository.findOne({
            userId: playerId,
        });

        this._updateInformation(campaign, playerId, campaignId, userDetailInDb);

        await this._saveUpdates(campaign, userDetailInDb);
    }
}
