import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import StateMachine from 'src/domains/common/StateMachine';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface AuthorizationMiddlewareContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachine: StateMachine;
    twoFactorHandler: TwoFactorHandler;
    logger: Logger;
}
