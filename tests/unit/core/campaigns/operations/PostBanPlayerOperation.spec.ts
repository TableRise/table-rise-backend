import sinon from 'sinon';
import PostBanPlayerOperation from 'src/core/campaigns/operations/PostBanPlayerOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Campaigns :: Operations :: PostBanPlayerOperation', () => {
    let postBanPlayerOperation: PostBanPlayerOperation,
        postBanPlayerService: any,
        schemaValidator: any,
        campaignsSchema: any,
        payload: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            postBanPlayerService = {
                banPlayer: sinon.spy(() => ({})),
            };

            payload = {
                campaignId: newUUID(),
                playerId: newUUID(),
            };

            campaignsSchema = {
                campaignBanPlayer: {},
            };

            schemaValidator = {
                entry: sinon.spy(() => {}),
            };

            postBanPlayerOperation = new PostBanPlayerOperation({
                postBanPlayerService,
                schemaValidator,
                campaignsSchema,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await postBanPlayerOperation.execute(payload);

            expect(postBanPlayerService.banPlayer).to.have.been.called();
        });
    });
});
