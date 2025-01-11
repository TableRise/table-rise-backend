import UpdateSecretQuestionService from 'src/core/users/services/users/UpdateSecretQuestionService';
import StateMachine from 'src/domains/common/StateMachine';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateSecretQuestionOperationContract {
    updateSecretQuestionService: UpdateSecretQuestionService;
    logger: Logger;
}

export interface UpdateSecretQuestionServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachine: StateMachine;
    logger: Logger;
}
