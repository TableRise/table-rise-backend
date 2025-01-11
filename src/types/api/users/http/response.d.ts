import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import {
    UserDetailInstance,
    UserSecretQuestion,
} from 'src/domains/users/schemas/userDetailsValidationSchema';
import { CookieOptions } from 'express';
import { JWTResponse } from '../methods';

export default interface UpdateResponse {
    message: string;
    name: string;
}

export interface RegisterUserResponse extends UserInstance {
    details: UserDetailInstance;
    token?: string;
}

export interface CompleteUserResponse {
    user: UserInstance;
    details: UserDetailInstance;
}

export interface ConfirmEmailResponse {
    status: string;
}

export interface LoginResponse {
    tokenData: JWTResponse;
    cookieOptions: CookieOptions;
}

export interface TwoFactorResponse {
    qrcode: string;
    active: boolean;
}

export interface ActivateSecretQuestionResponse {
    active: boolean;
}

export interface UpdateSecretQuestionResponse {
    newQuestion: UserSecretQuestion;
}
