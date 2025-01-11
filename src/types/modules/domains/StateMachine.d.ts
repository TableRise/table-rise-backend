import { userStatusEnum } from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface StateMachineContract {
    usersRepository: UsersRepository;
    logger: Logger;
}

export interface StateMachineProps {
    flows: stateFlowsEnum;
    status: userStatusEnum;
}
