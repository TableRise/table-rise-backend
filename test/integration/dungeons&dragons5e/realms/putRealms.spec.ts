import request from 'supertest';
import app from 'src/app';
import DatabaseManagement, { DnDRealm, Internacional } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG realms in database', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('dungeons&dragons5e', 'Realms');
    const realm = mocks.realm.instance as Internacional<DnDRealm>;
    const { _id: _, ...realmPayload } = realm;

    const newRealmPayload = {
        en: { ...realmPayload.en, name: 'Fire' },
        pt: { ...realmPayload.pt, name: 'Fogo' },
    };

    let documentId: string;

    afterAll(async () => {
        await model.connection.close();
    });

    describe('When update one rpg realm', () => {
        it('should return updated realm', async () => {
            const keysToTest = ['name', 'description', 'thumbnail'];

            const response = await model.create(realmPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/dnd5e/realms/${documentId}`)
                .send(newRealmPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Fire');
            expect(body.pt.name).toBe('Fogo');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/realms/${documentId}`)
                .send({ data: null } as unknown as Internacional<DnDRealm>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/realms/${generateNewMongoID()}`)
                .send({ active: true, ...newRealmPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/realms/${generateNewMongoID()}`)
                .send(newRealmPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a realm with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});