import StateMachine from 'src/domains/common/StateMachine';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface VerifyUserMiddlewareContract {
    usersRepository: UsersRepository;
    stateMachine: StateMachine;
    logger: Logger;
}
