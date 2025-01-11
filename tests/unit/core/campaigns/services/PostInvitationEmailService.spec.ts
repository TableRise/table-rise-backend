import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import PostInvitationEmailService from 'src/core/campaigns/services/PostInvitationEmailService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Campaigns :: Services :: PostInvitationEmailService', () => {
    let postInvitationEmailService: PostInvitationEmailService,
        campaign: CampaignInstance,
        emailSender: any,
        payload: any,
        httpRequestErrors: HttpRequestErrors;

    const logger = (): void => {};

    context('#sendEmail', () => {
        context('When sendEmail with success', () => {
            beforeEach(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                emailSender = {
                    send: () => ({
                        success: true,
                    }),
                };

                payload = {
                    campaignId: campaign.campaignId,
                    targetEmail: 'teste@email.com',
                    userId: newUUID(),
                    username: 'joaquim',
                };

                postInvitationEmailService = new PostInvitationEmailService({
                    emailSender,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                try {
                    await postInvitationEmailService.sendEmail(payload);
                } catch (error) {
                    expect('it should not be here').to.be.equal(false);
                }
            });
        });

        context('When sendEmail fails', () => {
            beforeEach(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                emailSender = {
                    send: () => ({
                        success: false,
                    }),
                };

                payload = {
                    campaignId: campaign.campaignId,
                    targetEmail: 'teste@email.com',
                    userId: newUUID(),
                    username: 'joaquim',
                };

                postInvitationEmailService = new PostInvitationEmailService({
                    emailSender,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                try {
                    await postInvitationEmailService.sendEmail(payload);

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'Some problem ocurred in email sending'
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.EXTERNAL_ERROR)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.EXTERNAL_ERROR);
                }
            });
        });
    });
});
