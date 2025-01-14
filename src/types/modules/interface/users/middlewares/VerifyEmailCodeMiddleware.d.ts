import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import StateMachine from 'src/domains/common/StateMachine';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface VerifyEmailCodeMiddlewareContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachine: StateMachine;
    logger: Logger;
}
