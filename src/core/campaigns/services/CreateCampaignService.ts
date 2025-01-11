import {
    __FullCampaign,
    __CampaignEnriched,
    __CampaignSaved,
    __CampaignSerialized,
} from 'src/types/api/campaigns/methods';
import { CampaignPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { FileObject } from 'src/types/shared/file';

export default class CreateCampaignService {
    private readonly _campaignsRepository;
    private readonly _serializer;
    private readonly _imageStorageClient;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
        serializer,
        imageStorageClient,
    }: CampaignCoreDependencies['createCampaignServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._serializer = serializer;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;

        this.enrichment = this.enrichment.bind(this);
        this.save = this.save.bind(this);
        this.serialize = this.serialize.bind(this);
    }

    public async serialize(campaign: CampaignPayload): Promise<__CampaignSerialized> {
        this._logger('info', 'Serialize - CreateCampaignService');
        return this._serializer.postCampaign(campaign);
    }

    public async enrichment(
        campaign: __FullCampaign,
        userId: string,
        image?: FileObject
    ): Promise<__CampaignEnriched> {
        this._logger('info', 'Enrichment - CreateCampaignService');
        campaign.campaignPlayers = [
            {
                userId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        delete campaign.visibility;

        if (image) {
            campaign.cover = await this._imageStorageClient.upload(image);
        } else {
            delete campaign.cover;
        }

        campaign.ageRestriction = Number(campaign.ageRestriction);

        campaign.createdAt = new Date().toISOString();
        campaign.updatedAt = new Date().toISOString();
        campaign.password = await SecurePasswordHandler.hashPassword(campaign.password);

        return campaign;
    }

    public async save(campaign: __FullCampaign): Promise<__CampaignSaved> {
        this._logger('info', 'Save - CreateCampaignService');
        return this._campaignsRepository.create({
            ...campaign,
        });
    }
}
