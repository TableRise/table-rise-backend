import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import { CampaignJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import dataGenerator from '../dataGenerator';

function createCampaignFaker({
    campaignId = newUUID(),
}: CampaignInstance): CampaignInstance {
    return {
        campaignId,
        title: dataGenerator.title,
        description: dataGenerator.description,
        visibility: dataGenerator.visibility,
        system: dataGenerator.system,
        ageRestriction: dataGenerator.ageRestriction,
        cover: dataGenerator.cover,
        campaignPlayers: dataGenerator.campaignPlayers,
        matchData: dataGenerator.matchData,
        infos: dataGenerator.infos,
        password: dataGenerator.password,
        lores: dataGenerator.lores,
        images: dataGenerator.images,
        createdAt: dataGenerator.createdAt.toISOString(),
        updatedAt: dataGenerator.updatedAt.toISOString(),
    } as CampaignInstance;
}

export default function generateCampaignsFaker({
    count,
    campaignId,
}: CampaignJSONPayload): CampaignInstance[] {
    const campaigns: CampaignInstance[] = [];

    for (let index = 0; index <= count; index += 1) {
        campaigns.push(createCampaignFaker({ campaignId } as CampaignInstance));
    }

    return campaigns;
}
