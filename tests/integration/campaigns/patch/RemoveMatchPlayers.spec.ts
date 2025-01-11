import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';
import sinon from 'sinon';

describe('When a player is removed from a match', () => {
    let campaign: CampaignInstance;

    before(async () => {
        campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);
    });

    after(() => {
        sinon.restore();
    });

    it('should sucessfully remove a player from a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId}/remove/match/players`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
    });
});
