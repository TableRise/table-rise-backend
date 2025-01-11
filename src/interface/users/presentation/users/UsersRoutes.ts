import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/domains/common/helpers/parametersWrapper';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import desc from 'src/interface/users/presentation/users/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const BASE_PATH = '/users';

export default class UsersRoutes {
    private readonly _usersController;
    private readonly _verifyIdMiddleware;
    private readonly _authorizationMiddleware;
    private readonly _imageMiddleware;
    private readonly _verifyEmailCodeMiddleware;
    private readonly _verifyUserMiddleware;
    private readonly _loginPassport;
    private readonly _authenticatePassport;

    constructor({
        usersController,
        authorizationMiddleware,
        verifyIdMiddleware,
        imageMiddleware,
        verifyEmailCodeMiddleware,
        verifyUserMiddleware,
        loginPassport,
        authenticatePassport,
    }: InterfaceDependencies['usersRoutesContract']) {
        this._usersController = usersController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._imageMiddleware = imageMiddleware;
        this._verifyEmailCodeMiddleware = verifyEmailCodeMiddleware;
        this._authorizationMiddleware = authorizationMiddleware;
        this._verifyUserMiddleware = verifyUserMiddleware;
        this._loginPassport = loginPassport;
        this._authenticatePassport = authenticatePassport;
    }

    public routes(): routeInstance[] {
        this._loginPassport.localStrategy();
        this._authenticatePassport.cookieStrategy();

        return [
            // GET
            {
                method: 'get',
                path: `${BASE_PATH}/verify`,
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'email', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                controller: this._usersController.verifyEmail,
                options: {
                    tag: 'authentication',
                    description: desc.verify,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/all`,
                controller: this._usersController.getUsers,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._authorizationMiddleware.checkAdminRole,
                        this._verifyUserMiddleware.userStatus,
                    ],
                    tag: 'users',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/logout`,
                controller: this._usersController.logoutUser,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'authentication',
                    description: desc.logoutUser,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._usersController.getUserById,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'users',
                    description: desc.get,
                },
            },

            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/register`,
                controller: this._usersController.register,
                schema: DomainDataFaker.mocks.createUserMock,
                options: {
                    tag: 'register',
                    description: desc.register,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/login`,
                controller: this._usersController.login,
                schema: DomainDataFaker.mocks.loginMock,
                options: {
                    middlewares: [passport.authenticate('local', { session: false })],
                    tag: 'authentication',
                    description: desc.login,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/update/picture`,
                parameters: [...generateIDParam()],
                controller: this._usersController.profilePicture,
                schema: DomainDataFaker.mocks.uploadPicture,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._imageMiddleware.multer().single('picture'),
                        this._imageMiddleware.fileType,
                        this._verifyIdMiddleware,
                    ],
                    tag: 'management',
                    description: desc.profilePicture,
                    fileUpload: true,
                },
            },

            // PUT
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update`,
                parameters: [...generateIDParam()],
                controller: this._usersController.update,
                schema: DomainDataFaker.mocks.updateUserMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.update,
                },
            },

            // PATCH
            {
                method: 'patch',
                path: `${BASE_PATH}/authenticate/email`,
                parameters: [
                    ...generateQueryParam(3, [
                        { name: 'email', type: 'string' },
                        { name: 'code', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                controller: this._usersController.internalAuthentication,
                options: {
                    middlewares: [this._verifyEmailCodeMiddleware.verify],
                    tag: 'authentication',
                    description: desc.emailCode,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/authenticate/2fa`,
                parameters: [
                    ...generateQueryParam(3, [
                        { name: 'email', type: 'string' },
                        { name: 'token', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                controller: this._usersController.internalAuthentication,
                options: {
                    middlewares: [this._authorizationMiddleware.twoFactor],
                    tag: 'authentication',
                    description: desc.token2FA,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/authenticate/secret-question`,
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'email', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                schema: DomainDataFaker.mocks.activateSecretQuestionMock,
                controller: this._usersController.internalAuthentication,
                options: {
                    middlewares: [this._authorizationMiddleware.secretQuestion],
                    tag: 'authentication',
                    description: desc.secretQuestion,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/question/activate`,
                parameters: [...generateIDParam()],
                controller: this._usersController.activateSecretQuestion,
                schema: DomainDataFaker.mocks.activateSecretQuestionMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.activateQuestion,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/question/update`,
                parameters: [...generateIDParam()],
                controller: this._usersController.updateSecretQuestion,
                schema: DomainDataFaker.mocks.updateSecretQuestionMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.updateSecretQuestion,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/activate`,
                parameters: [...generateIDParam()],
                controller: this._usersController.activateTwoFactor,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._verifyIdMiddleware,
                    ],
                    tag: 'management',
                    description: desc.activate2FA,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/reset`,
                parameters: [...generateIDParam()],
                controller: this._usersController.resetTwoFactor,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._verifyIdMiddleware,
                    ],
                    tag: 'management',
                    description: desc.reset2FA,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/email`,
                parameters: [...generateIDParam()],
                controller: this._usersController.updateEmail,
                schema: DomainDataFaker.mocks.updateEmailMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.updateEmail,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/update/password`,
                controller: this._usersController.updatePassword,
                schema: DomainDataFaker.mocks.updatePasswordMock,
                parameters: [
                    ...generateQueryParam(1, [{ name: 'email', type: 'string' }]),
                ],
                options: {
                    tag: 'management',
                    description: desc.updatePassword,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/game-info`,
                controller: this._usersController.updateGameInfo,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(3, [
                        { name: 'infoId', type: 'string' },
                        { name: 'targetInfo', type: 'string' },
                        { name: 'operation', type: 'string' },
                    ]),
                ],
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.updateGameInfo,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/reset`,
                controller: this._usersController.resetProfile,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.resetProfile,
                },
            },

            // DELETE
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete`,
                parameters: [...generateIDParam()],
                controller: this._usersController.delete,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.deleteProfile,
                },
            },
        ] as unknown as routeInstance[];
    }
}
