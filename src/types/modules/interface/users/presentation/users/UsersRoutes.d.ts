import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';
import UsersController from 'src/interface/users/presentation/users/UsersController';
import AuthorizationMiddleware from 'src/interface/common/middlewares/AuthorizationMiddleware';
import VerifyEmailCodeMiddleware from 'src/interface/users/middlewares/VerifyEmailCodeMiddleware';
import ImageMiddleware from 'src/interface/common/middlewares/ImageMiddleware';
import VerifyUserMiddleware from 'src/interface/common/middlewares/VerifyUserMiddleware';
import LoginPassport from 'src/interface/users/strategies/LocalStrategy';
import AuthenticatePassport from 'src/interface/common/strategies/CookieStrategy';

export interface UsersRoutesContract {
    usersController: UsersController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
    imageMiddleware: ImageMiddleware;
    verifyEmailCodeMiddleware: VerifyEmailCodeMiddleware;
    verifyUserMiddleware: VerifyUserMiddleware;
    loginPassport: LoginPassport;
    authenticatePassport: AuthenticatePassport;
}
