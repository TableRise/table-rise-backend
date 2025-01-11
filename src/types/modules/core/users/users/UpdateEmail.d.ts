import UpdateEmailService from 'src/core/users/services/users/UpdateEmailService';
import { SchemasUserType } from 'src/domains/users/schemas';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';
import StateMachine from 'src/domains/common/StateMachine';

export interface UpdateEmailOperationContract {
    updateEmailService: UpdateEmailService;
    schemaValidator: SchemaValidator;
    usersSchema: SchemasUserType;
    logger: Logger;
}

export interface UpdateEmailServiceContract {
    usersRepository: UsersRepository;
    stateMachine: StateMachine;
    logger: Logger;
}

export interface UserEmail {
    user: UserInstance;
    email: string;
}
