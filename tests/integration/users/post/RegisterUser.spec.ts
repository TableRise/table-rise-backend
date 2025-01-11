import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When a user is created', () => {
    context('And all data is correct', () => {
        before(() => {
            process.env.EMAIL_SENDING = 'on';
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct user created with details', async () => {
            const payload = DomainDataFaker.mocks.createUserMock;

            const { body } = await requester()
                .post('/users/register')
                .send(payload)
                .expect(HttpStatusCode.CREATED);

            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');
            expect(body).to.have.property('inProgress');
            expect(body.inProgress)
                .to.have.property('status')
                .that.is.equal('wait-to-confirm');
            expect(body).to.have.property('picture');
            expect(body.picture).to.have.property('link');

            expect(body).to.have.property('details');
            expect(body.details).to.have.property('userId');
            expect(body.details).to.have.property('gameInfo');
            expect(body.details.gameInfo)
                .to.have.property('campaigns')
                .that.is.an('array');
            expect(body.details.gameInfo)
                .to.have.property('characters')
                .that.is.an('array');
            expect(body.details.gameInfo).to.have.property('badges').that.is.an('array');
            expect(body.details).to.have.property('role').that.is.equal('user');
        });
    });
});
