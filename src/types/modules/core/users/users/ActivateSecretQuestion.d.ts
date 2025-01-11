import StateMachine from 'src/domains/common/StateMachine';
import ActivateSecretQuestionService from 'src/core/users/services/users/ActivateSecretQuestionService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ActivateSecretQuestionOperationContract {
    activateSecretQuestionService: ActivateSecretQuestionService;
    logger: Logger;
}

export interface ActivateSecretQuestionServiceContract {
    usersRepository: UsersRepository;
    stateMachine: StateMachine;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
