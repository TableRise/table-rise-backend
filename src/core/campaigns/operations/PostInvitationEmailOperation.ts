import { PostInvitationEmailPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostInvitationEmailOperation {
    private readonly _campaignsSchema;
    private readonly _schemaValidator;
    private readonly _postInvitationEmailService;
    private readonly _getCampaignByIdService;
    private readonly _logger;

    constructor({
        campaignsSchema,
        schemaValidator,
        postInvitationEmailService,
        getCampaignByIdService,
        logger,
    }: CampaignCoreDependencies['postInvitationEmailOperation']) {
        this._campaignsSchema = campaignsSchema;
        this._schemaValidator = schemaValidator;
        this._postInvitationEmailService = postInvitationEmailService;
        this._getCampaignByIdService = getCampaignByIdService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        targetEmail,
        campaignId,
        userId,
        username,
    }: PostInvitationEmailPayload): Promise<void> {
        this._logger('info', 'Execute - PostInvitationEmailOperation');
        this._schemaValidator.entry(this._campaignsSchema.campaignInvitationEmailZod, {
            targetEmail,
            campaignId,
            userId,
            username,
        });

        await this._getCampaignByIdService.get({ campaignId });

        await this._postInvitationEmailService.sendEmail({
            targetEmail,
            campaignId,
            userId,
            username,
        });
    }
}
