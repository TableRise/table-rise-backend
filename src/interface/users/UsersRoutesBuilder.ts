import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import bindMiddleware from 'src/domains/common/helpers/bindMiddleware';

const router = Router();

const ROUTES_WITH_NO_VERIFY = [
    '/register',
    '/start-machine-flow',
    '/login',
    '/verify',
    '/:id/delete',
    '/authenticate/email',
    '/authenticate/2fa',
    '/authenticate/secret-question',
    '/update/password',
];

export default class UsersRoutesBuilder {
    private readonly _usersRoutes;
    private readonly _oAuthRoutes;
    private readonly _verifyUserMiddleware;

    constructor({
        usersRoutes,
        oAuthRoutes,
        verifyUserMiddleware,
    }: InterfaceDependencies['usersRoutesBuilderContract']) {
        this._usersRoutes = usersRoutes;
        this._oAuthRoutes = oAuthRoutes;
        this._verifyUserMiddleware = verifyUserMiddleware;
    }

    private _users(): { usersRoutes: Router; usersSwagger: routeInstance[] } {
        const usersRoutesToBuild = bindMiddleware(
            this._verifyUserMiddleware.userStatus,
            this._usersRoutes.routes(),
            {
                substringLoc: 6,
                addMethod: 'push',
                pathsToIgnore: ROUTES_WITH_NO_VERIFY,
            }
        );

        const usersRoutes = buildRouter(usersRoutesToBuild, router);
        const usersSwagger = this._usersRoutes.routes();

        return { usersRoutes, usersSwagger };
    }

    private _oAuth(): { oAuthRoutes: Router; oAuthSwagger: routeInstance[] } {
        const oAuthRoutes = buildRouter(this._oAuthRoutes.routes(), router);
        const oAuthSwagger = this._oAuthRoutes.routes();

        return { oAuthRoutes, oAuthSwagger };
    }

    public get(): {
        usersSwagger: routeInstance[];
        usersRoutes: { users: Router; oAuth: Router };
    } {
        const usersSwagger = [
            ...this._oAuth().oAuthSwagger,
            ...this._users().usersSwagger,
        ];
        const usersRoutes = {
            users: this._users().usersRoutes,
            oAuth: this._oAuth().oAuthRoutes,
        };

        return { usersSwagger, usersRoutes };
    }
}
