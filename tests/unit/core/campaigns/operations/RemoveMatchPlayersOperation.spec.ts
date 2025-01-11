import sinon from 'sinon';
import RemoveMatchPlayersOperation from 'src/core/campaigns/operations/RemoveMatchPlayersOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: RemoveMatchPlayersOperation', () => {
    let removeMatchPlayersOperation: RemoveMatchPlayersOperation,
        removeMatchPlayersService: any,
        matchPlayersPayload: any,
        schemaValidator: any,
        campaignsSchema: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign has the match players', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                const userId = newUUID();

                matchPlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId,
                };

                campaign.campaignPlayers = [
                    {
                        userId,
                        characterIds: [],
                        role: 'player',
                        status: 'pending',
                    },
                ];

                removeMatchPlayersService = {
                    removeMatchPlayers: sinon.spy(() => ({
                        campaign,
                        userDetails: {},
                    })),
                    save: sinon.spy(() => campaign),
                };

                schemaValidator = {
                    entry: () => {},
                };

                campaignsSchema = {
                    campaignsRemoveMatchPlayersZod: {},
                };

                removeMatchPlayersOperation = new RemoveMatchPlayersOperation({
                    removeMatchPlayersService,
                    schemaValidator,
                    campaignsSchema,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const removePlayerTest = await removeMatchPlayersOperation.execute(
                    matchPlayersPayload
                );

                expect(
                    removeMatchPlayersService.removeMatchPlayers
                ).to.have.been.called();
                expect(removeMatchPlayersService.save).to.have.been.called();
                expect(removePlayerTest[0]).to.have.property('userId');
                expect(removePlayerTest[0].userId).to.be.equal(
                    matchPlayersPayload.userId
                );
                expect(removePlayerTest[0]).to.have.property('characterIds');
                expect(removePlayerTest[0].characterIds.length).to.be.equal(0);
                expect(removePlayerTest[0]).to.have.property('role');
                expect(removePlayerTest[0].role).to.be.equal('player');
                expect(removePlayerTest[0]).to.have.property('status');
                expect(removePlayerTest[0].status).to.be.equal('pending');
            });
        });
    });
});
