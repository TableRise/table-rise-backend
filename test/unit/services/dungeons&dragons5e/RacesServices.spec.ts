import DatabaseManagement from '@tablerise/database-management';
import RacesServices from 'src/services/dungeons&dragons5e/RacesServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import SchemaValidator from 'src/services/helpers/SchemaValidator';

import logger from '@tablerise/dynamic-logger';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: RacesServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new SchemaValidator();

    const RacesModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Races');
    const RacesServicesMock = new RacesServices(RacesModelMock, logger, ValidateDataMock, schema['dungeons&dragons5e']);

    const racesMockInstance = mocks.race.instance as Internacional<Race>;
    const { _id: _, ...racesMockPayload } = racesMockInstance;

    describe('When the recover all race service is called', () => {
        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findAll').mockResolvedValue([racesMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await RacesServicesMock.findAll();
            expect(responseTest).toStrictEqual([racesMockInstance]);
        });
    });

    describe('When the recover all disabled races service is called', () => {
        const raceMockDisabled = { ...racesMockInstance, active: false };

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findAll').mockResolvedValue([raceMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await RacesServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([raceMockDisabled]);
        });
    });

    describe('When the recover a race by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findOne').mockResolvedValueOnce(racesMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await RacesServicesMock.findOne(racesMockInstance._id as string);
            expect(responseTest).toBe(racesMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a race is called', () => {
        const raceMockID = racesMockInstance._id as string;
        const raceMockUpdateInstance = {
            en: { ...racesMockInstance.en, name: 'None' },
            pt: { ...racesMockInstance.pt, name: 'None' },
        };

        const raceMockPayloadWithoutActive = { ...racesMockPayload };
        delete raceMockPayloadWithoutActive.active;

        const { name: _1, ...racesMockEnWithoutName } = racesMockPayload.en;
        const { name: _2, ...racesMockPtWithoutName } = racesMockPayload.pt;
        const raceMockPayloadWrong = {
            en: racesMockEnWithoutName,
            pt: racesMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'update').mockResolvedValueOnce(raceMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await RacesServicesMock.update(
                raceMockID,
                raceMockPayloadWithoutActive as Internacional<Race>
            );
            expect(responseTest).toBe(raceMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await RacesServicesMock.update(raceMockID, raceMockPayloadWrong as Internacional<Race>);
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
                await RacesServicesMock.update('inexistent_id', racesMockPayload as Internacional<Race>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.update('inexistent_id', raceMockPayloadWithoutActive as Internacional<Race>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability race is called', () => {
        const raceMockID = racesMockInstance._id as string;
        const raceMockUpdateInstance = {
            _id: raceMockID,
            active: false,
            en: { ...racesMockInstance.en },
            pt: { ...racesMockInstance.pt },
        };

        const raceMockFindInstance = {
            _id: raceMockID,
            active: true,
            en: { ...racesMockInstance.en },
            pt: { ...racesMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Race ${raceMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Race ${raceMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findOne')
                .mockResolvedValueOnce(raceMockFindInstance)
                .mockResolvedValueOnce({ ...raceMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...raceMockFindInstance, active: true })
                .mockResolvedValueOnce(raceMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(RacesModelMock, 'update')
                .mockResolvedValueOnce(raceMockUpdateInstance)
                .mockResolvedValueOnce({ ...raceMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await RacesServicesMock.updateAvailability(raceMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await RacesServicesMock.updateAvailability(raceMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the race is already enabled', async () => {
            try {
                await RacesServicesMock.updateAvailability(raceMockID, true);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the race is already disabled', async () => {
            try {
                await RacesServicesMock.updateAvailability(raceMockID, false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
