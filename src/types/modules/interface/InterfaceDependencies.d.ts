import { RoutesWrapperContract } from 'src/types/modules/interface/common/RoutesWrapper';
import { AuthorizationMiddlewareContract } from 'src/types/modules/interface/common/middlewares/AuthorizationMiddleware';
import { ImageMiddlewareContract } from 'src/types/modules/interface/common/middlewares/ImageMiddleware';
import { UsersRoutesMiddlewareContract } from 'src/types/modules/interface/users/middlewares/UsersRoutesMiddleware';
import { VerifyEmailCodeMiddlewareContract } from 'src/types/modules/interface/users/middlewares/VerifyEmailCodeMiddleware';
import { UsersRoutesContract } from 'src/types/modules/interface/users/presentation/users/UsersRoutes';
import { UsersControllerContract } from 'src/types/modules/interface/users/presentation/users/UsersController';
import { UsersRoutesBuilderContract } from 'src/types/modules/interface/users/UsersRoutesBuilder';
import { OAuthRoutesContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthRoutes';
import { OAuthControllerContract } from 'src/types/modules/interface/users/presentation/oauth/OAuthController';
import { CampaignsRoutesMiddlewareContract } from 'src/types/modules/interface/campaigns/middlewares/CampaignsRoutesMiddleware';
import { CampaignsRoutesContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsRoutes';
import { VerifyMatchMiddlewareContract } from './campaigns/middlewares/VerifyMatchMiddlewareContract';
import { VerifyUserMiddlewareContract } from './common/middlewares/VerifyUserMiddleware';
import { StateMachineFlowsMiddlewareContract } from './common/middlewares/StateMachineFlowsMiddleware';

export default interface InterfaceDependencies {
    // <--------- USERS DOMAIN --------->
    // Wrapper
    routesWrapperContract: RoutesWrapperContract;

    // Middlewares
    authorizationMiddlewareContract: AuthorizationMiddlewareContract;
    stateMachineFlowsMiddlewareContract: StateMachineFlowsMiddlewareContract;
    imageMiddlewareContract: ImageMiddlewareContract;
    usersRoutesMiddlewareContract: UsersRoutesMiddlewareContract;
    verifyEmailCodeMiddlewareContract: VerifyEmailCodeMiddlewareContract;
    campaignsRoutesMiddlewareContract: CampaignsRoutesMiddlewareContract;
    verifyUserMiddlewareContract: VerifyUserMiddlewareContract;

    // Routes and Controllers
    campaignsRoutesContract: CampaignsRoutesContract;
    usersRoutesContract: UsersRoutesContract;
    usersControllerContract: UsersControllerContract;
    usersRoutesBuilderContract: UsersRoutesBuilderContract;
    oAuthRoutesContract: OAuthRoutesContract;
    oAuthControllerContract: OAuthControllerContract;

    // <--------- CAMPAIGNS DOMAIN --------->
    // Middlewares
    campaignsRoutesMiddlewareContract: CampaignsRoutesMiddlewareContract;
    verifyMatchMiddlewareContract: VerifyMatchMiddlewareContract;

    // Routes and Controllers
    campaignsRoutesContract: CampaignsRoutesContract;
    campaignsControllerContract: CampaignsControllerContract;
    campaignsRoutesBuilderContract: CampaignsRoutesBuilderContract;
}
