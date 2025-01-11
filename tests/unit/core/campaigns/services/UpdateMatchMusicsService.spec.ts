import sinon from 'sinon';
import UpdateMatchMusicsService from 'src/core/campaigns/services/UpdateMatchMusicsService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateMatchMusicsService', () => {
    let updateMatchMusicsService: UpdateMatchMusicsService,
        campaignsRepository: any,
        updateMusicsPayload: any,
        campaignMusicsLength: number,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#updateMatchMusics', () => {
        context('When a music is added to match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignMusicsLength = campaign.matchData?.musics.length ?? 0;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateMusicsPayload = {
                    campaignId: campaign.campaignId,
                    youtubeLink: 'https://youtu.be/12345',
                    title: 'Main Theme 2',
                    operation: 'add',
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchMusicsService.updateMatchMusics(
                    updateMusicsPayload
                );
                expect(matchDataUpdated.matchData?.musics.length).to.be.not.equal(
                    campaignMusicsLength
                );
                expect(matchDataUpdated.matchData?.musics.length).to.be.equal(
                    campaignMusicsLength + 1
                );
            });
        });

        context('When a music is added to match data - music already exists', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                if (campaign.matchData)
                    campaign.matchData.musics = [
                        {
                            title: 'Main Theme 2',
                            youtubeLink: 'https://youtu.be/12345',
                        },
                    ];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                updateMusicsPayload = {
                    campaignId: campaign.campaignId,
                    youtubeLink: 'https://youtu.be/12345',
                    title: 'Main Theme 2',
                    operation: 'add',
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateMatchMusicsService.updateMatchMusics(updateMusicsPayload);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Music link already added');
                    expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY)
                    );
                }
            });
        });

        context('When a music is removed from match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                if (campaign.matchData)
                    campaign.matchData.musics = [
                        {
                            title: 'Main Theme 2',
                            youtubeLink: 'https://youtu.be/123',
                        },
                    ];

                campaignMusicsLength = campaign.matchData?.musics.length ?? 0;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                updateMusicsPayload = {
                    campaignId: campaign.campaignId,
                    youtubeLink: 'https://youtu.be/123456',
                    title: 'Main Theme 2',
                    operation: 'remove',
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchMusicsService.updateMatchMusics(
                    updateMusicsPayload
                );
                expect(matchDataUpdated.matchData?.musics.length).to.be.not.equal(
                    campaignMusicsLength
                );
                expect(matchDataUpdated.matchData?.musics.length).to.be.equal(
                    campaignMusicsLength - 1
                );
            });
        });
    });

    context('#save', () => {
        context('When a campaign with new music is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                if (campaign.matchData)
                    campaign.matchData.musics = [
                        {
                            title: 'Main Theme',
                            youtubeLink: 'https://youtu.be/123',
                        },
                    ];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                updateMatchMusicsService = new UpdateMatchMusicsService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await updateMatchMusicsService.save(campaign);

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
