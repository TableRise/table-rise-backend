import sinon from 'sinon';
import FormData from 'form-data';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import requester from 'tests/support/requester';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('When a campaign is created', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';

        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct campaign created', async () => {
            const campaignPayload = CampaignDomainDataFaker.mocks.createCampaignMock;

            campaignPayload.cover = new FormData() as unknown as { isBinary: boolean };

            const { body } = await requester()
                .post('/campaigns/create')
                .field('ageRestriction', campaignPayload.ageRestriction)
                .field('description', campaignPayload.description)
                .field('system', campaignPayload.system)
                .field('title', campaignPayload.title)
                .field('visibility', campaignPayload.visibility as string)
                .expect(HttpStatusCode.CREATED);

            expect(body).to.have.property('campaignId');
            expect(body).to.have.property('title');
            expect(body.title).to.be.equal(campaignPayload.title);
            expect(body).to.have.property('cover');
            expect(body.cover).to.be.equal(null);
            expect(body).to.have.property('description');
            expect(body.description).to.be.equal(campaignPayload.description);
            expect(body).to.have.property('ageRestriction');
            expect(body.ageRestriction).to.be.equal(campaignPayload.ageRestriction);
            expect(body).to.have.property('system');
            expect(body.system).to.be.equal(campaignPayload.system);
            expect(body).to.have.property('campaignPlayers');
            expect(body.campaignPlayers[0].userId).to.be.equal(userLoggedId);
            expect(body).to.have.property('matchData');
            expect(body.matchData).to.be.equal(null);
            expect(body).to.have.property('infos');
            expect(body.infos.visibility).to.be.equal(campaignPayload.visibility);
            expect(body).to.have.property('lores');
            expect(body.lores).to.be.equal(null);
            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');
        });
    });
});
