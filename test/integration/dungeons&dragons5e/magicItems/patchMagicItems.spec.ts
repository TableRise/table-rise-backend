import request from 'supertest';
import app from 'src/app';
import DatabaseManagement, { DnDMagicItem, Internacional } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Patch RPG magic items in database', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('dungeons&dragons5e', 'MagicItems');
    const magicItem = mocks.magicItems.instance as Internacional<DnDMagicItem>;
    const { _id: _, ...magicItemPayload } = magicItem;

    let documentId: string;

    afterAll(async () => {
        await model.connection.close();
    });

    describe('When update availability one rpg magic item', () => {
        it('should return a string with magic item updated id', async () => {
            const response = await model.create(magicItemPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .patch(`/dnd5e/magicItems/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Magic Items ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(magicItemPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .patch(`/dnd5e/magicItems/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Entity already enabled');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await request(app).patch(`/dnd5e/magicItems/${documentId}?availability=false`);

            const { body } = await request(app)
                .patch(`/dnd5e/magicItems/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Entity already disabled');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await request(app)
                .patch(`/dnd5e/magicItems/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .patch(`/dnd5e/magicItems/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a magic item with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});