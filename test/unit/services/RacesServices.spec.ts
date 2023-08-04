import RacesModel from 'src/database/models/RacesModel';
import RacesServices from 'src/services/RacesServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race } from 'src/schemas/racesValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: RacesServices', () => {
    const RacesModelMock = new RacesModel();
    const RacesServicesMock = new RacesServices(RacesModelMock, logger);
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
                const err = error as Error;
                expect(err.message).toBe('NotFound a race with provided ID');
                expect(err.stack).toBe('404');
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

        const { name: _1, ...racesMockEnWithoutName } = racesMockPayload.en;
        const { name: _2, ...racesMockPtWithoutName } = racesMockPayload.pt;
        const racesMockPayloadWrong = {
            en: racesMockEnWithoutName,
            pt: racesMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'update').mockResolvedValueOnce(raceMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await RacesServicesMock.update(raceMockID, racesMockPayload as Internacional<Race>);
            expect(responseTest).toBe(raceMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await RacesServicesMock.update(raceMockID, racesMockPayloadWrong as Internacional<Race>);
            } catch (error) {
                const err = error as Error;
                expect(JSON.parse(err.message)[0].path).toStrictEqual(['en', 'name']);
                expect(JSON.parse(err.message)[0].message).toBe('Required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.update('inexistent_id', racesMockPayload as Internacional<Race>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a race with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a race is called', () => {
        const raceMockID = racesMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findOne').mockResolvedValueOnce(racesMockInstance).mockResolvedValue(null);

            jest.spyOn(RacesModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete race and not return any data', async () => {
            try {
                await RacesServicesMock.delete(raceMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a race with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});