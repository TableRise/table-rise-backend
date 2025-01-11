import sinon from 'sinon';
import AddMatchPlayersOperation from 'src/core/campaigns/operations/AddMatchPlayersOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: AddMatchPlayersOperation', () => {
    let addMatchPlayersOperation: AddMatchPlayersOperation,
        addMatchPlayersService: any,
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
                };

                campaign.campaignPlayers = [
                    {
                        userId,
                        characterIds: [],
                        role: 'player',
                        status: 'pending',
                    },
                ];

                addMatchPlayersService = {
                    addMatchPlayers: sinon.spy(() => ({
                        campaign,
                        userDetails: {},
                    })),
                    save: sinon.spy(() => campaign),
                };

                schemaValidator = {
                    entry: () => {},
                };

                campaignsSchema = {
                    campaignsAddMatchPlayersZod: {},
                };

                addMatchPlayersOperation = new AddMatchPlayersOperation({
                    addMatchPlayersService,
                    schemaValidator,
                    campaignsSchema,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const addPlayerTest = await addMatchPlayersOperation.execute(
                    matchPlayersPayload
                );

                expect(addMatchPlayersService.addMatchPlayers).to.have.been.called();
                expect(addMatchPlayersService.save).to.have.been.called();
                expect(addPlayerTest[0]).to.have.property('userId');
                expect(addPlayerTest[0].userId).to.be.equal(matchPlayersPayload.userId);
                expect(addPlayerTest[0]).to.have.property('characterIds');
                expect(addPlayerTest[0].characterIds.length).to.be.equal(0);
                expect(addPlayerTest[0]).to.have.property('role');
                expect(addPlayerTest[0].role).to.be.equal('player');
                expect(addPlayerTest[0]).to.have.property('status');
                expect(addPlayerTest[0].status).to.be.equal('pending');
            });
        });
    });
});
