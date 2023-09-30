import DatabaseManagement from '@tablerise/database-management';
import ClassesServices from 'src/services/dungeons&dragons5e/ClassesServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import SchemaValidator from 'src/services/helpers/SchemaValidator';

import logger from '@tablerise/dynamic-logger';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: ClassesServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new SchemaValidator();

    const ClassesModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Classes');
    const ClassesServicesMock = new ClassesServices(
        ClassesModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );

    const classMockInstance = mocks.class.instance as Internacional<Class>;
    const { _id: _, ...classMockPayload } = classMockInstance;

    describe('When the recover all enabled classes service is called', () => {
        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findAll').mockResolvedValue([classMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await ClassesServicesMock.findAll();
            expect(responseTest).toStrictEqual([classMockInstance]);
        });
    });

    describe('When the recover all disabled classes service is called', () => {
        const classMockDisabled = { ...classMockInstance, active: false };

        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findAll').mockResolvedValue([classMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await ClassesServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([classMockDisabled]);
        });
    });

    describe('When the recover a class by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findOne').mockResolvedValueOnce(classMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await ClassesServicesMock.findOne(classMockInstance._id as string);
            expect(responseTest).toBe(classMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ClassesServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a class is called', () => {
        const classMockID = classMockInstance._id as string;
        const classMockUpdateInstance = {
            en: { ...classMockInstance.en, name: 'None' },
            pt: { ...classMockInstance.pt, name: 'None' },
        };
        const classMockPayloadWithoutActive = { ...classMockPayload };
        delete classMockPayloadWithoutActive.active;

        const { name: _1, ...classesMockEnWithoutName } = classMockPayload.en;
        const { name: _2, ...classesMockPtWithoutName } = classMockPayload.pt;
        const classMockPayloadWrong = {
            en: classesMockEnWithoutName,
            pt: classesMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'update')
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await ClassesServicesMock.update(
                classMockID,
                classMockPayloadWithoutActive as Internacional<Class>
            );
            expect(responseTest).toBe(classMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await ClassesServicesMock.update(classMockID, classMockPayloadWrong as Internacional<Class>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.details).toHaveLength(2);
                expect(err.details[0].attribute[0]).toBe('en');
                expect(err.details[0].attribute[1]).toBe('name');
                expect(err.details[0].reason).toBe('Required');
                expect(err.code).toBe(422);
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when try to update availability', async () => {
            try {
                await ClassesServicesMock.update('inexistent_id', classMockPayload as Internacional<Class>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ClassesServicesMock.update(
                    'inexistent_id',
                    classMockPayloadWithoutActive as Internacional<Class>
                );
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability class is called', () => {
        const classMockID = classMockInstance._id as string;
        const classMockUpdateInstance = {
            _id: classMockID,
            active: false,
            en: { ...classMockInstance.en },
            pt: { ...classMockInstance.pt },
        };

        const classMockFindInstance = {
            _id: classMockID,
            active: true,
            en: { ...classMockInstance.en },
            pt: { ...classMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Class ${classMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Class ${classMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findOne')
                .mockResolvedValueOnce(classMockFindInstance)
                .mockResolvedValueOnce({ ...classMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...classMockFindInstance, active: true })
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(ClassesModelMock, 'update')
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValueOnce({ ...classMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await ClassesServicesMock.updateAvailability(classMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await ClassesServicesMock.updateAvailability(classMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the class is already enabled', async () => {
            try {
                await ClassesServicesMock.updateAvailability(classMockID, true);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the class is already disabled', async () => {
            try {
                await ClassesServicesMock.updateAvailability(classMockID, false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ClassesServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
