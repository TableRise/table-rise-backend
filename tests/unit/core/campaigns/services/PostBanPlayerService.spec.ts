import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import PostBanPlayerService from 'src/core/campaigns/services/PostBanPlayerService';
import newUUID from 'src/domains/common/helpers/newUUID';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Campaigns :: Services :: PostBanPlayerService', () => {
    let postBanPlayerService: PostBanPlayerService,
        usersDetailsRepository: any,
        campaignsRepository: any,
        payload: any;

    const logger = (): void => {};

    context('#banPlayer', () => {
        context('When banPlayer with success', () => {
            let campaign: any;
            let campaignId: any;
            let playerId: any;
            let userDetail: any;

            beforeEach(() => {
                campaignId = newUUID();
                playerId = newUUID();

                campaign = {
                    campaignPlayers: [
                        {
                            userId: playerId,
                            role: 'any',
                        },
                    ],
                    bannedPlayers: [],
                };

                userDetail = {
                    gameInfo: {
                        bannedFromCampaigns: [],
                    },
                };

                usersDetailsRepository = {
                    findOne: () => userDetail,
                    update: () => {},
                };

                campaignsRepository = {
                    findOne: () => campaign,
                    update: () => ({
                        success: true,
                    }),
                };

                payload = {
                    campaignId,
                    playerId,
                };

                postBanPlayerService = new PostBanPlayerService({
                    usersDetailsRepository,
                    campaignsRepository,
                    logger,
                });
            });

            it('should run without an error', async () => {
                try {
                    await postBanPlayerService.banPlayer(payload);
                } catch (error) {
                    expect('it should not be here').to.be.equal(false);
                }
            });
        });

        context('When banPlayer fails', () => {
            context('when the player is not in the campaign', () => {
                let campaign: any;
                let campaignId: any;
                let playerId: any;
                let userDetail: any;

                beforeEach(() => {
                    campaignId = newUUID();
                    playerId = newUUID();

                    campaign = {
                        campaignPlayers: [
                            {
                                userId: 'any_playerId',
                                role: 'any',
                            },
                        ],
                        bannedPlayers: [],
                    };

                    userDetail = {
                        gameInfo: {
                            bannedFromCampaigns: [],
                        },
                    };

                    usersDetailsRepository = {
                        findOne: () => userDetail,
                        update: () => {},
                    };

                    campaignsRepository = {
                        findOne: () => campaign,
                        update: () => ({
                            success: true,
                        }),
                    };

                    payload = {
                        campaignId,
                        playerId,
                    };

                    postBanPlayerService = new PostBanPlayerService({
                        usersDetailsRepository,
                        campaignsRepository,
                        logger,
                    });
                });

                it('should return the correct error', async () => {
                    try {
                        await postBanPlayerService.banPlayer(payload);

                        expect('it should not be here').to.be.equal(false);
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal('Player not in match');
                        expect(err.name).to.be.equal(
                            getErrorName(HttpStatusCode.NOT_FOUND)
                        );
                        expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    }
                });
            });

            context('when the player is the dungeon master', () => {
                let campaign: any;
                let campaignId: any;
                let playerId: any;
                let userDetail: any;

                beforeEach(() => {
                    campaignId = newUUID();
                    playerId = newUUID();

                    campaign = {
                        campaignPlayers: [
                            {
                                userId: playerId,
                                role: 'dungeon_master',
                            },
                        ],
                        bannedPlayers: [],
                    };

                    userDetail = {
                        gameInfo: {
                            bannedFromCampaigns: [],
                        },
                    };

                    usersDetailsRepository = {
                        findOne: () => userDetail,
                        update: () => {},
                    };

                    campaignsRepository = {
                        findOne: () => campaign,
                        update: () => ({
                            success: true,
                        }),
                    };

                    payload = {
                        campaignId,
                        playerId,
                    };

                    postBanPlayerService = new PostBanPlayerService({
                        usersDetailsRepository,
                        campaignsRepository,
                        logger,
                    });
                });

                it('should return the correct error', async () => {
                    try {
                        await postBanPlayerService.banPlayer(payload);

                        expect('it should not be here').to.be.equal(false);
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal('Player is the dungeon master');
                        expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                        expect(err.name).to.be.equal(
                            getErrorName(HttpStatusCode.BAD_REQUEST)
                        );
                    }
                });
            });

            context('when the player is player already banned', () => {
                let campaign: any;
                let campaignId: any;
                let playerId: any;
                let userDetail: any;

                beforeEach(() => {
                    campaignId = newUUID();
                    playerId = newUUID();

                    campaign = {
                        campaignPlayers: [
                            {
                                userId: 'any_playerId',
                                role: 'any',
                            },
                        ],
                        bannedPlayers: [playerId],
                    };

                    userDetail = {
                        gameInfo: {
                            bannedFromCampaigns: [],
                        },
                    };

                    usersDetailsRepository = {
                        findOne: () => userDetail,
                        update: () => {},
                    };

                    campaignsRepository = {
                        findOne: () => campaign,
                        update: () => ({
                            success: true,
                        }),
                    };

                    payload = {
                        campaignId,
                        playerId,
                    };

                    postBanPlayerService = new PostBanPlayerService({
                        usersDetailsRepository,
                        campaignsRepository,
                        logger,
                    });
                });

                it('should return the correct error', async () => {
                    try {
                        await postBanPlayerService.banPlayer(payload);

                        expect('it should not be here').to.be.equal(false);
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal('Player is already banned');
                        expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                        expect(err.name).to.be.equal(
                            getErrorName(HttpStatusCode.BAD_REQUEST)
                        );
                    }
                });
            });
        });
    });
});
