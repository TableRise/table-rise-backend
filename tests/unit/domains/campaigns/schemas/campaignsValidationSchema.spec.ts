import campaignsZodSchema, {
    CampaignPayload,
} from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Domains :: Campaigns :: Schemas :: CampaignsValidationSchema', () => {
    let campaign: CampaignPayload[];

    const schemaValidator = new SchemaValidator();

    context('When data is correct with schema', () => {
        beforeEach(() => {
            campaign = DomainDataFaker.generateCampaignsJSON().map((campaign) => ({
                title: campaign.title,
                cover: campaign.cover,
                description: campaign.description,
                visibility: campaign.visibility,
                system: campaign.system,
                password: campaign.password,
                ageRestriction: campaign.ageRestriction,
            }));
        });

        it('should not have errors', () => {
            try {
                schemaValidator.entry(campaignsZodSchema, campaign[0]);
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
        });
    });

    context('When data is not correct with schema', () => {
        beforeEach(() => {
            campaign = DomainDataFaker.generateCampaignsJSON().map((campaign) => ({
                title: campaign.title,
                cover: campaign.cover,
                visibility: campaign.visibility,
                system: campaign.system,
                ageRestriction: campaign.ageRestriction,
            })) as CampaignPayload[];
        });

        it('should throw errors', () => {
            try {
                schemaValidator.entry(campaignsZodSchema, campaign[0]);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');

                expect(err.details).to.have.length(2);
                expect(err.details[0].attribute).to.be.equal('description');
                expect(err.details[0].reason).to.be.equal('Required');
            }
        });
    });
});
