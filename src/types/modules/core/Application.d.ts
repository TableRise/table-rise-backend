import DatabaseManagement from '@tablerise/database-management';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';
import UsersRoutesMiddleware from 'src/interface/users/middlewares/UsersRoutesMiddleware';
import CampaignsRoutesMiddleware from 'src/interface/campaigns/middlewares/CampaignsRoutesMiddleware';
import swaggerGenerator, {
    generateSwaggerFiles,
} from 'src/domains/common/helpers/swaggerGenerator';
import { Logger } from '../../Logger';
import DungeonsAndDragonsRoutesMiddleware from 'src/interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware';
import AccessHeadersMiddleware from 'src/interface/common/middlewares/AccessHeadersMiddleware';
import SocketIO from 'src/infra/clients/SocketIO';
import ManagerCronJob from 'src/domains/users/helpers/ManagerCronJob';
import RoutesWrapper from 'src/interface/common/RoutesWrapper';

export interface ApplicationContract {
    usersRoutesMiddleware: UsersRoutesMiddleware;
    campaignsRoutesMiddleware: CampaignsRoutesMiddleware;
    dungeonsAndDragonsRoutesMiddleware: DungeonsAndDragonsRoutesMiddleware;
    campaignsRoutesMiddleware: CampaignsRoutesMiddleware;
    swaggerGenerator: typeof swaggerGenerator;
    generateSwaggerFiles: typeof generateSwaggerFiles;
    errorMiddleware: typeof ErrorMiddleware;
    accessHeadersMiddleware: typeof AccessHeadersMiddleware;
    database: DatabaseManagement;
    socketIO: SocketIO;
    routesWrapper: RoutesWrapper;
    logger: Logger;
    managerCronJob: ManagerCronJob;
}
