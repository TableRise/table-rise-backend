import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

describe('Patch RPG backgrounds in database', () => {
    let model: MongoModel<Internacional<Background>>;
    const background = mocks.background.instance as Internacional<Background>;
    const { _id: _, ...backgroundPayload } = background;

    let documentId: string;

    beforeAll(() => {
        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'Backgrounds');
    });

    describe('When update availability one rpg background', () => {
        it('should return a string with background updated id', async () => {
            const response = await model.create(backgroundPayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/backgrounds/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Background ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(backgroundPayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/backgrounds/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await requester().patch(`/dnd5e/backgrounds/${documentId}?availability=false`);

            const { body } = await requester()
                .patch(`/dnd5e/backgrounds/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/backgrounds/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/backgrounds/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
