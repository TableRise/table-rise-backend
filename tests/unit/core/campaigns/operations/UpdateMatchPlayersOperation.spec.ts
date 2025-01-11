import sinon from 'sinon';
import UpdateMatchPlayersOperation from 'src/core/campaigns/operations/UpdateMatchPlayersOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchPlayersOperation', () => {
    let updateMatchPlayersOperation: UpdateMatchPlayersOperation,
        updateMatchPlayersService: any,
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
                    characterId: newUUID(),
                    userId,
                    operation: 'add',
                };

                campaign.campaignPlayers = [
                    {
                        userId,
                        characterIds: [],
                        role: 'player',
                        status: 'pending',
                    },
                ];

                updateMatchPlayersService = {
                    updateMatchPlayers: sinon.spy(() => ({
                        campaign,
                        userDetails: {},
                    })),
                    save: sinon.spy(() => campaign),
                };

                schemaValidator = {
                    entry: () => {},
                };

                campaignsSchema = {
                    campaignsUpdateMatchPlayersZod: {},
                };

                updateMatchPlayersOperation = new UpdateMatchPlayersOperation({
                    updateMatchPlayersService,
                    schemaValidator,
                    campaignsSchema,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updatePlayerTest = await updateMatchPlayersOperation.execute(
                    matchPlayersPayload
                );

                expect(
                    updateMatchPlayersService.updateMatchPlayers
                ).to.have.been.called();
                expect(updateMatchPlayersService.save).to.have.been.called();
                expect(updatePlayerTest[0]).to.have.property('userId');
                expect(updatePlayerTest[0].userId).to.be.equal(
                    matchPlayersPayload.userId
                );
                expect(updatePlayerTest[0]).to.have.property('characterIds');
                expect(updatePlayerTest[0].characterIds.length).to.be.equal(0);
                expect(updatePlayerTest[0]).to.have.property('role');
                expect(updatePlayerTest[0].role).to.be.equal('player');
                expect(updatePlayerTest[0]).to.have.property('status');
                expect(updatePlayerTest[0].status).to.be.equal('pending');
            });
        });
    });
});
