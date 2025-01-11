import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { AddMatchPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddMatchPlayersOperation {
    private readonly _addMatchPlayersService;
    private readonly _schemaValidator;
    private readonly _campaignsSchema;
    private readonly _logger;

    constructor({
        addMatchPlayersService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['addMatchPlayersOperationContract']) {
        this._addMatchPlayersService = addMatchPlayersService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: AddMatchPlayersPayload): Promise<Player[]> {
        this._logger('info', 'Execute - AddMatchPlayersOperation');

        this._schemaValidator.entry(
            this._campaignsSchema.campaignsAddMatchPlayersZod,
            payload
        );

        const { campaign, userDetails } =
            await this._addMatchPlayersService.addMatchPlayers(payload);

        const savedCampaign = await this._addMatchPlayersService.save(
            campaign,
            userDetails
        );

        return savedCampaign.campaignPlayers;
    }
}
