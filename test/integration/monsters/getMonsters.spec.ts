import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import MonstersModel from 'src/database/models/MonstersModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Monster } from 'src/schemas/monstersValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG monsters from database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new MonstersModel();
    const monster = mocks.monster.instance;
    const { _id: _, ...monsterMockPayload } = monster as Internacional<Monster>;

    let documentId: string;

    describe('When request all rpg monsters', () => {
        it('should return an array with monsters', async () => {
            const keysToTest = [
                'name',
                'characteristics',
                'stats',
                'abilityScore',
                'skills',
                'actions',
                'picture'
            ];

            const response = await model.create(monsterMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/monsters').expect(HttpStatusCode.OK);

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
            const keysToTest = [
                'name',
                'characteristics',
                'stats',
                'abilityScore',
                'skills',
                'actions',
                'picture'
            ];

            await model.create(monsterMockPayload);

            const { body } = await request(app).get(`/monsters/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app).get(`/monsters/${generateNewMongoID()}`).expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});