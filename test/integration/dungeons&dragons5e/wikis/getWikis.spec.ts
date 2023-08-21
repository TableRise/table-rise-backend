import requester from '../../../support/requester';
import DatabaseManagement, { DnDWiki, Internacional, mongoose, MongoModel } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Get RPG wikis from database', () => {
    let model: MongoModel<Internacional<DnDWiki>>;
    const wiki = mocks.wiki.instance;
    const { _id: _, ...wikiMockPayload } = wiki as Internacional<DnDWiki>;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => { logger('info', 'Test database connection instanciated'); })
            .catch(() => { logger('error', 'Test database connection failed'); });

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'Wikis');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request all rpg wikis', () => {
        it('should return an array with wikis', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            const response = await model.create(wikiMockPayload);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/wikis').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg wikis', () => {
        it('should return an array with disabled wikis', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            const weaponMockCopy = {
                active: false,
                en: { ...wikiMockPayload.en, active: false },
                pt: { ...wikiMockPayload.pt, active: false },
            };

            const response = await model.create(weaponMockCopy);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/wikis/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg wiki', () => {
        it('should return a wiki instance', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            await model.create(wikiMockPayload);

            const { body } = await requester.get(`/dnd5e/wikis/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester
                .get(`/dnd5e/wikis/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
