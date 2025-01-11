import sinon from 'sinon';
import AddMatchPlayersService from 'src/core/campaigns/services/AddMatchPlayersService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';

describe('Core :: Camapaigns :: Services :: AddMatchPlayersService', async () => {
    let addMatchPlayersService: AddMatchPlayersService,
        campaignsRepository: any,
        usersDetailsRepository: any,
        addPlayersPayload: any,
        campaignPlayersLength: number,
        campaign: CampaignInstance,
        userDetails: UserDetailInstance,
        hashPassword: any;

    const logger = (): void => {};

    context('#addMatchPlayers', () => {
        context('When a player is added to match data', () => {
            before(async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                hashPassword = await SecurePasswordHandler.hashPassword('1234');
                campaign.password = hashPassword;
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaignPlayersLength = campaign.campaignPlayers.length;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                addPlayersPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId: userDetails.userId,
                    password: '1234',
                };

                addMatchPlayersService = new AddMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should return the add campaign', async () => {
                const matchDataAdded = await addMatchPlayersService.addMatchPlayers(
                    addPlayersPayload
                );
                expect(matchDataAdded.campaign.campaignPlayers.length).to.be.not.equal(
                    campaignPlayersLength
                );
                expect(matchDataAdded.campaign.campaignPlayers.length).to.be.equal(
                    campaignPlayersLength + 1
                );
            });
        });

        context('When a player is added to match - player already in the match', () => {
            before(async () => {
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
                hashPassword = await SecurePasswordHandler.hashPassword('1234');
                campaign.password = hashPassword;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                addPlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    password: '1234',
                };

                addMatchPlayersService = new AddMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await addMatchPlayersService.addMatchPlayers(addPlayersPayload);
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

        context('When a player is added to match data - wrong password', () => {
            before(async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                hashPassword = await SecurePasswordHandler.hashPassword('1234');
                campaign.password = hashPassword;
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaignPlayersLength = campaign.campaignPlayers.length;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                addPlayersPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId: userDetails.userId,
                    password: '0000',
                };

                addMatchPlayersService = new AddMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should return the add campaign', async () => {
                try {
                    await addMatchPlayersService.addMatchPlayers(addPlayersPayload);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Unauthorized');
                    expect(err.code).to.be.equal(HttpStatusCode.UNAUTHORIZED);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.UNAUTHORIZED)
                    );
                }
            });
        });

        context('When a player is added to match - no character', () => {
            before(async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                userDetails.userId = '555';
                hashPassword = await SecurePasswordHandler.hashPassword('1234');
                campaign.password = hashPassword;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                addPlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    password: '1234',
                };

                addMatchPlayersService = new AddMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await addMatchPlayersService.addMatchPlayers(addPlayersPayload);
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
                before(async () => {
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
                    hashPassword = await SecurePasswordHandler.hashPassword('1234');
                    campaign.password = hashPassword;

                    campaignsRepository = {
                        findOne: () => ({ ...campaign }),
                    };

                    usersDetailsRepository = {
                        findOne: () => ({ ...userDetails }),
                    };

                    addPlayersPayload = {
                        campaignId: campaign.campaignId,
                        characterId: newUUID(),
                        userId: userDetails.userId,
                        password: '1234',
                    };

                    addMatchPlayersService = new AddMatchPlayersService({
                        logger,
                        campaignsRepository,
                        usersDetailsRepository,
                    });
                });

                it('should throw an error', async () => {
                    try {
                        await addMatchPlayersService.addMatchPlayers(addPlayersPayload);
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
            before(async () => {
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
                hashPassword = await SecurePasswordHandler.hashPassword('1234');
                campaign.password = hashPassword;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                addPlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    password: '1234',
                };

                addMatchPlayersService = new AddMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await addMatchPlayersService.addMatchPlayers(addPlayersPayload);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Player is banned');
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.FORBIDDEN));
                }
            });
        });
    });

    context('#save', () => {
        context('When a campaign with a new player is saved', () => {
            before(async () => {
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
                hashPassword = await SecurePasswordHandler.hashPassword('1234');
                campaign.password = hashPassword;

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                usersDetailsRepository = {
                    update: sinon.spy(() => {}),
                };

                addMatchPlayersService = new AddMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await addMatchPlayersService.save(
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
