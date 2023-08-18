import request from 'supertest';
import app from 'src/app';
import DatabaseManagement, { DnDItem, Internacional } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG Items from database', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('dungeons&dragons5e', 'Items');
    const item = mocks.item.instance as Internacional<DnDItem>;
    const { _id: _, ...itemMockPayload } = item;

    let documentId: string;

    afterAll(async () => {
        await model.connection.close();
    });

    describe('When request all rpg Items', () => {
        it('should return an array with Items', async () => {
            const keysToTest = Object.keys(item.en);

            const response = await model.create(itemMockPayload);

            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/items').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg monsters', () => {
        it('should return an array with disabled monsters', async () => {
            const keysToTest = Object.keys(item.en);

            const itemMockCopy = {
                active: false,
                en: { ...itemMockPayload.en, active: false },
                pt: { ...itemMockPayload.pt, active: false },
            };

            const response = await model.create(itemMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/items/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg Item', () => {
        it('should return a Item instance', async () => {
            const keysToTest = Object.keys(item.en);

            await model.create(itemMockPayload);

            const { body } = await request(app).get(`/dnd5e/items/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/items/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an item with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});