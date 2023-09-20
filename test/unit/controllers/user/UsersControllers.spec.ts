import { Request, Response } from 'express';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import UsersServices from 'src/services/user/UsersServices';
import UsersControllers from 'src/controllers/user/UsersControllers';
import ValidateData from 'src/support/helpers/ValidateData';
import schema from 'src/schemas';
import mock from 'src/support/mocks/user';

describe('Controllers :: User :: UsersControllers', () => {
    const DM = new DatabaseManagement();
    const validateData = new ValidateData(logger);

    const UsersModel = DM.modelInstance('user', 'Users');
    const UserDetailsModel = DM.modelInstance('user', 'UserDetails');

    const UsersServicesMock = new UsersServices(UsersModel, UserDetailsModel, logger, validateData, schema.user);
    const UsersControllersMock = new UsersControllers(UsersServicesMock, logger);

    const request = {} as Request;
    const response = {} as Response;

    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;
    userInstanceMock._id = '65075e05ca9f0d3b2485194f';
    const {
        providerId: _,
        createdAt: _1,
        updatedAt: _2,
        _id: _3,
        tag: _4,
        ...userInstanceMockPayload
    } = userInstanceMock;
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;

    const userPayload = {
        ...userInstanceMockPayload,
        details: userDetailsInstanceMockPayload,
    };

    const userResponse = {
        ...userInstanceMock,
        details: userDetailsInstanceMock,
    };

    describe('When a request is made to register a new user', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(UsersServicesMock, 'register').mockResolvedValue(userResponse);
        });

        it('should return correct data in response json with status 200', async () => {
            request.body = userPayload;
            await UsersControllersMock.register(request, response);
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith(userResponse);
        });
    });
});