import sinon from 'sinon';
import UpdateMatchPlayersService from 'src/core/campaigns/services/UpdateMatchPlayersService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Camapaigns :: Services :: UpdateMatchPlayersService', () => {
    let updateMatchPlayersService: UpdateMatchPlayersService,
        campaignsRepository: any,
        usersDetailsRepository: any,
        updatePlayersPayload: any,
        campaignPlayersLength: number,
        userDetailsCampaignsLength: number,
        campaign: CampaignInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#updateMatchPlayers', () => {
        context('When a player is added to match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaignPlayersLength = campaign.campaignPlayers.length;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                updatePlayersPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId: userDetails.userId,
                    operation: 'add',
                };

                updateMatchPlayersService = new UpdateMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated =
                    await updateMatchPlayersService.updateMatchPlayers(
                        updatePlayersPayload
                    );
                expect(matchDataUpdated.campaign.campaignPlayers.length).to.be.not.equal(
                    campaignPlayersLength
                );
                expect(matchDataUpdated.campaign.campaignPlayers.length).to.be.equal(
                    campaignPlayersLength + 1
                );
            });
        });

        context('When a player is added to match - player already in the match', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaign.campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'player',
                        status: 'pending',
                    },
                ];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                updatePlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    operation: 'add',
                };

                updateMatchPlayersService = new UpdateMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateMatchPlayersService.updateMatchPlayers(
                        updatePlayersPayload
                    );
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Player already in match');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });

        context('When a player is added to match - no character', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                userDetails.userId = '555';

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                updatePlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    operation: 'add',
                };

                updateMatchPlayersService = new UpdateMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateMatchPlayersService.updateMatchPlayers(
                        updatePlayersPayload
                    );
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Character not found or not belongs to user'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                }
            });
        });

        context(
            'When a player is added to match - player already is dungeon master',
            () => {
                before(() => {
                    campaign = DomainDataFaker.generateCampaignsJSON()[0];
                    userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                    campaign.campaignPlayers = [
                        {
                            userId: userDetails.userId,
                            characterIds: [],
                            role: 'dungeon_master',
                            status: 'active',
                        },
                    ];

                    campaignsRepository = {
                        findOne: () => ({ ...campaign }),
                    };

                    usersDetailsRepository = {
                        findOne: () => ({ ...userDetails }),
                    };

                    updatePlayersPayload = {
                        campaignId: campaign.campaignId,
                        characterId: newUUID(),
                        userId: userDetails.userId,
                        operation: 'add',
                    };

                    updateMatchPlayersService = new UpdateMatchPlayersService({
                        logger,
                        campaignsRepository,
                        usersDetailsRepository,
                    });
                });

                it('should throw an error', async () => {
                    try {
                        await updateMatchPlayersService.updateMatchPlayers(
                            updatePlayersPayload
                        );
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal(
                            'The new player can not be also the master'
                        );
                        expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                        expect(err.name).to.be.equal(
                            getErrorName(HttpStatusCode.BAD_REQUEST)
                        );
                    }
                });
            }
        );

        context('When a player is added to match - player banned from match', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaign.campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'player',
                        status: 'banned',
                    },
                ];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                updatePlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    operation: 'add',
                };

                updateMatchPlayersService = new UpdateMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await updateMatchPlayersService.updateMatchPlayers(
                        updatePlayersPayload
                    );
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Player is banned');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.FORBIDDEN));
                }
            });
        });

        context('When a player is removed from match', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaign.campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'player',
                        status: 'banned',
                    },
                ];

                userDetails.gameInfo.campaigns = [campaign.campaignId];

                userDetailsCampaignsLength = userDetails.gameInfo.campaigns.length;
                campaignPlayersLength = campaign.campaignPlayers.length;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                updatePlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    operation: 'remove',
                };
                updateMatchPlayersService = new UpdateMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should update the user details game info campaigns', async () => {
                const matchDataUpdated =
                    await updateMatchPlayersService.updateMatchPlayers(
                        updatePlayersPayload
                    );

                expect(
                    matchDataUpdated.userDetails.gameInfo.campaigns.length
                ).to.be.not.equal(userDetailsCampaignsLength);

                expect(
                    matchDataUpdated.userDetails.gameInfo.campaigns.length
                ).to.be.equal(userDetailsCampaignsLength - 1);
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated =
                    await updateMatchPlayersService.updateMatchPlayers(
                        updatePlayersPayload
                    );
                expect(matchDataUpdated.campaign.campaignPlayers.length).to.be.not.equal(
                    campaignPlayersLength
                );
                expect(matchDataUpdated.campaign.campaignPlayers.length).to.be.equal(
                    campaignPlayersLength - 1
                );
            });
        });
    });

    context('#save', () => {
        context('When a campaign with a new player is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaign.campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'player',
                        status: 'banned',
                    },
                ];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                usersDetailsRepository = {
                    update: sinon.spy(() => {}),
                };

                updateMatchPlayersService = new UpdateMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await updateMatchPlayersService.save(
                    campaign,
                    userDetails
                );

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: userDetails,
                });
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
