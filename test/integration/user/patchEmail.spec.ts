import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import EmailSender from 'src/services/user/helpers/EmailSender';
import JWTGenerator from 'src/services/authentication/helpers/JWTGenerator';

describe('Patch user email in database', () => {
    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;

    userInstanceMock.email = `${Math.random()}${userInstanceMock.email}`;

    const { providerId: _, createdAt: _1, updatedAt: _2, tag: _4, ...userInstanceMockPayload } = userInstanceMock;
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;

    const userPayload = {
        ...userInstanceMockPayload,
        twoFactorSecret: { active: true },
        details: userDetailsInstanceMockPayload,
    };

    const emailUpdatePayload = mock.user.userEmailUpdate;
    emailUpdatePayload.email = `${Math.random()}${emailUpdatePayload.email}`;

    beforeAll(async () => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });
        requester.set('Authorization', 'Bearer test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When update user email', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: 'XRFS78' });
            jest.spyOn(JWTGenerator, 'verify').mockReturnValue(true);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should save the updated email in the database', async () => {
            const userResponse = await requester
                .post('/profile/register')
                .send(userPayload)
                .expect(HttpStatusCode.CREATED);

            const userId: string = userResponse.body._id;
            const code: string = userResponse.body.inProgress.code;

            const response = await requester
                .patch(`/profile/${userId}/update/email?code=${code}`)
                .send(emailUpdatePayload)
                .expect(HttpStatusCode.NO_CONTENT);

            expect(response.status).toBe(204);
        });
    });
});