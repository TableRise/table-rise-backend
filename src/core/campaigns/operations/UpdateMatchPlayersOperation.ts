import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UpdateMatchPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchPlayersOperation {
    private readonly _updateMatchPlayersService;
    private readonly _schemaValidator;
    private readonly _campaignsSchema;
    private readonly _logger;

    constructor({
        updateMatchPlayersService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['updateMatchPlayersOperationContract']) {
        this._updateMatchPlayersService = updateMatchPlayersService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateMatchPlayersPayload): Promise<Player[]> {
        this._logger('info', 'Execute - UpdateMatchPlayersOperation');

        this._schemaValidator.entry(
            this._campaignsSchema.campaignsUpdateMatchPlayersZod,
            payload
        );

        const { campaign, userDetails } =
            await this._updateMatchPlayersService.updateMatchPlayers(payload);

        const savedCampaign = await this._updateMatchPlayersService.save(
            campaign,
            userDetails
        );

        return savedCampaign.campaignPlayers;
    }
}
