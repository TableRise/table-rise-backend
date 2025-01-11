import {
    UserSecretQuestion,
    UserDetailPayload,
} from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserPayload } from 'src/domains/users/schemas/usersValidationSchema';
import { CompleteOAuthPayload } from 'src/domains/users/schemas/oAuthValidationSchema';
import { FileObject } from 'src/types/shared/file';

export interface UserExternal {
    providerId: string;
    email: string;
    name: string;
}

export interface GetByIdPayload {
    userId: string;
}

export interface UpdateGameInfoPayload {
    userId: string;
    infoId: string;
    targetInfo: 'campaigns' | 'badges' | 'characters';
    operation: 'add' | 'remove';
}

export interface UserImagePayload {
    userId: string;
    image: FileObject;
}

export interface CompleteOAuth {
    userId: string;
    payload: CompleteOAuthPayload;
}

export interface emailUpdatePayload {
    email: string;
}

export interface RegisterUserPayload extends UserPayload {
    details: UserDetailPayload;
}

export interface UpdateUserPayload {
    userId: string;
    payload: RegisterUserPayload;
}

export interface ConfirmEmailPayload {
    email: string;
    code: string;
}

export interface UpdateSecretQuestion {
    question: string;
    answer: string;
}

export interface UpdateSecretQuestionPayload {
    userId: string;
    payload: UpdateSecretQuestion;
}

export interface UpdateEmailPayload {
    userId: string;
    email: string;
}

export interface UpdatePasswordPayload {
    email: string;
    password: string;
}

export interface VerifyEmailPayload {
    email: string;
    flow: StateMachineFlowKeys;
}

export interface ActivateSecretQuestionPayload {
    userId: string;
    payload: UserSecretQuestion;
}
