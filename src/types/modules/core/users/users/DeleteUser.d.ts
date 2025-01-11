import DeleteUserService from 'src/core/users/services/users/DeleteUserService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface DeleteUserOperationContract {
    deleteUserService: DeleteUserService;
    logger: Logger;
}

export interface DeleteUserServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachine: StateMachine;
    logger: Logger;
}
