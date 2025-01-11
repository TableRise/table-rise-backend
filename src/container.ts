import nodemailer from 'nodemailer';
/* eslint-disable import/first */
import { createContainer, InjectionMode, asClass, asFunction, asValue } from 'awilix';
import path from 'path';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import SchemaValidator from './domains/common/helpers/SchemaValidator';
import schemas from './domains/users/schemas';
import campaignsSchemas from './domains/campaigns/schemas';
import EmailSender from './domains/users/helpers/EmailSender';
import swaggerGenerator from './domains/common/helpers/swaggerGenerator';
import Serializer from './domains/common/helpers/Serializer';
import VerifyIdMiddleware from './interface/common/middlewares/VerifyIdMiddleware';
import ErrorMiddleware from './interface/common/middlewares/ErrorMiddleware';
import Application from './core/Application';
import RoutesWrapper from './interface/common/RoutesWrapper';
import UsersRoutesBuilder from './interface/users/UsersRoutesBuilder';
import CampaignsRoutesBuilder from './interface/campaigns/CampaignsRoutesBuilder';
import AuthErrorMiddleware from './interface/common/middlewares/AuthErrorMiddleware';
import DungeonsAndDragonsRoutesBuilder from './interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder';
import { ContainerContract } from './types/container';
import TwoFactorHandler from './domains/common/helpers/TwoFactorHandler';
import ImageStorageClient from './infra/clients/ImageStorageClient';
import axios from 'axios';
import TokenForbidden from './domains/common/helpers/TokenForbidden';
import AccessHeadersMiddleware from './interface/common/middlewares/AccessHeadersMiddleware';
import SocketIO from './infra/clients/SocketIO';
import ManagerCronJob from './domains/users/helpers/ManagerCronJob';
import StateMachine from './domains/common/StateMachine';
import LoginPassport from './interface/users/strategies/LocalStrategy';
import AuthenticatePassport from './interface/common/strategies/CookieStrategy';

const configs = require(path.join(process.cwd(), 'tablerise.environment.js'));

export const container = createContainer({
    injectionMode: InjectionMode.PROXY,
}) as any;

export default function setup(
    { loadExt }: ContainerContract = {
        loadExt: process.env.NODE_ENV === 'develop' ? 'ts' : 'js',
    }
): void {
    container.loadModules(
        [
            `./core/**/*.${loadExt}`,
            `./infra/repositories/**/*.${loadExt}`,
            `./interface/common/middlewares/**/*.${loadExt}`,
            `./interface/users/presentation/**/*.${loadExt}`,
            `./interface/users/middlewares/**/*.${loadExt}`,
            `./interface/campaigns/presentation/**/*.${loadExt}`,
            `./interface/campaigns/middlewares/**/*.${loadExt}`,
            `./interface/dungeons&dragons5e/presentation/**/*.${loadExt}`,
            `./interface/dungeons&dragons5e/middlewares/**/*.${loadExt}`,
            `./interface/campaigns/presentation/**/*.${loadExt}`,
            `./interface/campaigns/middlewares/**/*.${loadExt}`,
        ],
        {
            formatName: 'camelCase',
            resolverOptions: { injectionMode: InjectionMode.PROXY },
            cwd: __dirname,
        }
    );

    container.register({
        // #Setup
        application: asClass(Application).singleton(),
        routesWrapper: asClass(RoutesWrapper).singleton(),
        usersRoutesBuilder: asClass(UsersRoutesBuilder).singleton(),
        campaignsRoutesBuilder: asClass(CampaignsRoutesBuilder).singleton(),
        dungeonsAndDragonsRoutesBuilder: asClass(
            DungeonsAndDragonsRoutesBuilder
        ).singleton(),
        database: asClass(DatabaseManagement).singleton(),
        redisClient: asValue(DatabaseManagement.connect(true, 'redis')),
        configs: asValue(configs),
        stateMachine: asClass(StateMachine).singleton(),

        // #Strategies
        loginPassport: asClass(LoginPassport).singleton(),
        authenticatePassport: asClass(AuthenticatePassport).singleton(),

        // #Helpers
        schemaValidator: asClass(SchemaValidator).singleton(),
        emailSender: asClass(EmailSender).singleton(),
        serializer: asClass(Serializer).singleton(),
        swaggerGenerator: asFunction(swaggerGenerator),
        twoFactorHandler: asClass(TwoFactorHandler).singleton(),
        tokenForbidden: asClass(TokenForbidden).singleton(),
        managerCronJob: asClass(ManagerCronJob).singleton(),

        // #Schemas
        usersSchema: asValue(schemas),
        campaignsSchema: asValue(campaignsSchemas),

        // #Clients
        imageStorageClient: asClass(ImageStorageClient),

        // #Connections
        socketIO: asClass(SocketIO),

        // #Libraries
        logger: asValue(logger),
        nodemailer: asValue(nodemailer),
        httpRequest: asValue(axios),

        // #Values
        emailType: asValue('common'),

        // #Function Middlewares
        verifyIdMiddleware: asValue(VerifyIdMiddleware),
        authErrorMiddleware: asValue(AuthErrorMiddleware),
        accessHeadersMiddleware: asValue(AccessHeadersMiddleware),
        errorMiddleware: asValue(ErrorMiddleware),
    });

    logger('info', '[ Container - Redis connection instanciated ]', true);
}
