import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

describe('Patch RPG items in database', () => {
    let model: MongoModel<Internacional<Item>>;
    const item = mocks.item.instance as Internacional<Item>;
    const { _id: _, ...itemPayload } = item;

    let documentId: string;

    beforeAll(() => {
        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'Items');
    });

    describe('When update availability one rpg item', () => {
        it('should return a string with item updated id', async () => {
            const response = await model.create(itemPayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/items/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Item ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(itemPayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/items/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await requester().patch(`/dnd5e/items/${documentId}?availability=false`);

            const { body } = await requester()
                .patch(`/dnd5e/items/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/items/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/items/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
