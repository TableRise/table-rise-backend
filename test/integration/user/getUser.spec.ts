import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import EmailSender from 'src/services/user/helpers/EmailSender';
// import JWTGenerator from 'src/services/authentication/helpers/JWTGenerator';
import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
// import AuthorizationMiddleware from 'src/middlewares/AuthorizationMiddleware';

describe('Post user in database', () => {
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

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When delete a user', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: 'XRFS78' });
        });

        afterAll(() => {
            jest.clearAllMocks();
        });
        it('should return correct status', async () => {
            const userResponse1 = await requester()
                .post('/profile/register')
                .send(userPayload)
                .expect(HttpStatusCode.CREATED);

            const userId1: string = userResponse1.body._id;

            await requester().patch(`/profile/${userId1}/confirm?code=XRFS78`).expect(HttpStatusCode.OK);

            const loginPayload = {
                email: userPayload.email,
                password: userPayload.password,
            };

            const loginResponse = await requester().post('/profile/login').send(loginPayload).expect(HttpStatusCode.OK);

            const token: string = loginResponse.body.token;

            const response = await requester()
                .get(`/profile/${userId1}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatusCode.OK);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('tag');
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).toHaveProperty('updatedAt');
            expect(response.body).toHaveProperty('details');
            expect(response.body).toHaveProperty('password');
            expect(response.body.details).toHaveProperty('userId');
            expect(response.body.email).toBe(userPayload.email);
            expect(response.body.nickname).toBe(userPayload.nickname);
        });
    });
});
