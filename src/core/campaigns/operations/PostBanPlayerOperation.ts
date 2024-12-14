import { PostBanPlayerPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostBanPlayerOperation {
    private readonly _campaignsSchema;
    private readonly _schemaValidator;
    private readonly _postBanPlayerService;
    private readonly _logger;

    constructor({
        campaignsSchema,
        schemaValidator,
        postBanPlayerService,
        logger,
    }: CampaignCoreDependencies['postBanPlayerOperation']) {
        this._campaignsSchema = campaignsSchema;
        this._schemaValidator = schemaValidator;
        this._postBanPlayerService = postBanPlayerService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ campaignId, playerId }: PostBanPlayerPayload): Promise<void> {
        this._logger('info', 'Execute - PostBanPlayerOperation');
        this._schemaValidator.entry(this._campaignsSchema.campaignBanPlayerZod, {
            campaignId,
            playerId,
        });

        await this._postBanPlayerService.banPlayer({
            campaignId,
            playerId,
        });
    }
}
