import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { RemoveMatchPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveMatchPlayersOperation {
    private readonly _removeMatchPlayersService;
    private readonly _schemaValidator;
    private readonly _campaignsSchema;
    private readonly _logger;

    constructor({
        removeMatchPlayersService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['removeMatchPlayersOperationContract']) {
        this._removeMatchPlayersService = removeMatchPlayersService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: RemoveMatchPlayersPayload): Promise<Player[]> {
        this._logger('info', 'Execute - RemoveMatchPlayersOperation');

        this._schemaValidator.entry(
            this._campaignsSchema.campaignsRemoveMatchPlayersZod,
            payload
        );

        const { campaign, userDetails } =
            await this._removeMatchPlayersService.removeMatchPlayers(payload);

        const savedCampaign = await this._removeMatchPlayersService.save(
            campaign,
            userDetails
        );

        return savedCampaign.campaignPlayers;
    }
}
