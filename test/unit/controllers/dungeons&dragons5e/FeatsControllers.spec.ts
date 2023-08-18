import DatabaseManagement, { DnDFeat, Internacional } from '@tablerise/database-management';
import { Request, Response } from 'express';
import FeatsServices from 'src/services/dungeons&dragons5e/FeatsServices';
import FeatsControllers from 'src/controllers/dungeons&dragons5e/FeatsControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: FeatsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const FeatsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Feats', { mock: true });
    const FeatsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
    const FeatsServicesMock = new FeatsServices(FeatsModelMock, logger, ValidateDataMock, FeatsSchemaMock);
    const FeatsControllersMock = new FeatsControllers(FeatsServicesMock, logger);

    const featMockInstance = mocks.feat.instance as Internacional<DnDFeat>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all feats', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'findAll').mockResolvedValue([featMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await FeatsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([featMockInstance]);
        });
    });

    describe('When a request is made to recover all feats disabled', () => {
        featMockInstance.active = false;
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'findAllDisabled').mockResolvedValue([featMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await FeatsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([featMockInstance]);
        });
    });

    describe('When a request is made to recover feat god by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'findOne').mockResolvedValue(featMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: featMockInstance._id as string };

            await FeatsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(featMockInstance);
        });
    });

    describe('When a request is made to update feat god by ID', () => {
        const featMockUpdateInstance = {
            en: { ...featMockInstance.en, name: 'Olympo' },
            pt: { ...featMockInstance.pt, name: 'Olympo' },
        };

        const { _id: _, ...featMockPayload } = featMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'update').mockResolvedValue(featMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: featMockInstance._id as string };
            request.body = featMockPayload;

            await FeatsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(featMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability background by ID', () => {
        const responseMessageMock = {
            message: 'Feat {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: featMockInstance._id as string };
            request.query = { availability: 'false' };

            await FeatsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});