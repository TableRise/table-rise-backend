import chai from 'chai';
import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import setup from 'src/container';
import logger from '@tablerise/dynamic-logger';

setup({ loadExt: 'ts' });
chai.use(require('dirty-chai'));
// @ts-expect-error Will create a new global property
global.expect = chai.expect;

process.env.JWT_SECRET = 'secret';

exports.mochaHooks = {
    async beforeAll() {
        await DatabaseManagement.connect(true, {
            db_username: 'root',
            db_password: 'secret',
            db_host: '127.0.0.1:27018',
            db_database: 'dungeons&dragons5e?authSource=admin',
            db_initialString: 'mongodb',
        });

        logger('test', 'Test database connected');

        const user = {
            userId: '6530214e4006e8046e11b723',
            inProgress: { status: 'done', code: '' },
            providerId: null,
            email: 'joe@email.com',
            password: '@Password61',
            nickname: 'joe_the_great',
            tag: `#9999`,
            picture: 'https://imgbb.com',
            twoFactorSecret: { active: false },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const details = {
            userDetailId: '653021554006e8046e11b727',
            userId: '6530214e4006e8046e11b723',
            firstName: 'Joe',
            lastName: 'Einstein',
            pronoun: 'he/his',
            secretQuestion: {
                question: 'What sound does the fox?',
                answer: 'Kikikikikiu',
            },
            birthday: '1995-10-25',
            gameInfo: { campaigns: [], characters: [], badges: [] },
            biography: 'Some bio',
            role: 'admin',
        };

        const UsersModel = new DatabaseManagement().modelInstance('user', 'Users');
        const UserDetailsModel = new DatabaseManagement().modelInstance(
            'user',
            'UserDetails'
        );

        await UsersModel.create(user);
        await UserDetailsModel.create(details);
        logger('test', 'Test user created with details');
    },

    async afterAll() {
        const UsersModel = new DatabaseManagement().modelInstance('user', 'Users');
        const UserDetailsModel = new DatabaseManagement().modelInstance(
            'user',
            'UserDetails'
        );

        await UsersModel.erase();
        await UserDetailsModel.erase();
        logger('test', 'Test user erased with details');

        await mongoose.connection.close();
        logger('test', 'Test database disconnected');
    },
};