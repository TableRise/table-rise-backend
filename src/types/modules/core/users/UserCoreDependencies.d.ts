import {
    ActivateSecretQuestionOperationContract,
    ActivateSecretQuestionServiceContract,
} from './users/ActivateSecretQuestion';
import {
    ActivateTwoFactorOperationContract,
    ActivateTwoFactorServiceContract,
} from './users/ActivateTwoFactor';
import {
    CreateUserOperationContract,
    CreateUserServiceContract,
} from './users/CreateUser';
import {
    DeleteUserOperationContract,
    DeleteUserServiceContract,
} from './users/DeleteUser';
import {
    GetUserByIdOperationContract,
    GetUserByIdServiceContract,
} from './users/GetUserById';
import { GetUsersOperationContract, GetUsersServiceContract } from './users/GetUsers';
import { LoginUserOperationContract, LoginUserServiceContract } from './users/LoginUser';
import {
    LogoutUserOperationContract,
    LogoutUserServiceContract,
} from './users/LogoutUser';
import {
    PictureProfileOperationContract,
    PictureProfileServiceContract,
} from './users/PictureProfile';
import {
    ResetProfileOperationContract,
    ResetProfileServiceContract,
} from './users/ResetProfile';
import {
    ResetTwoFactorOperationContract,
    ResetTwoFactorServiceContract,
} from './users/ResetTwoFactor';
import {
    VerifyEmailOperationContract,
    VerifyEmailServiceContract,
} from './users/VerifyEmail';
import {
    UpdateEmailOperationContract,
    UpdateEmailServiceContract,
} from './users/UpdateEmail';
import {
    UpdatePasswordOperationContract,
    UpdatePasswordServiceContract,
} from './users/UpdatePassword';
import {
    UpdateSecretQuestionOperationContract,
    UpdateSecretQuestionServiceContract,
} from './users/UpdateSecretQuestion';

export default interface UserCoreDependencies {
    // Operations
    activateSecretQuestionOperationContract: ActivateSecretQuestionOperationContract;
    activateTwoFactorOperationContract: ActivateTwoFactorOperationContract;
    resetTwoFactorOperationContract: ResetTwoFactorOperationContract;
    createUserOperationContract: CreateUserOperationContract;
    deleteUserOperationContract: DeleteUserOperationContract;
    getUserByIdOperationContract: GetUserByIdOperationContract;
    getUsersOperationContract: GetUsersOperationContract;
    logoutUserOperationContract: LogoutUserOperationContract;
    pictureProfileOperationContract: PictureProfileOperationContract;
    resetProfileOperationContract: ResetProfileOperationContract;
    updateEmailOperationContract: UpdateEmailOperationContract;
    updateGameInfoOperationContract: UpdateGameInfoOperationContract;
    updatePasswordOperationContract: UpdatePasswordOperationContract;
    updateSecretQuestionOperationContract: UpdateSecretQuestionOperationContract;
    updateUserOperationContract: UpdateUserOperationContract;
    verifyEmailOperationContract: VerifyEmailOperationContract;
    loginUserOperationContract: LoginUserOperationContract;

    // Services
    activateSecretQuestionServiceContract: ActivateSecretQuestionServiceContract;
    activateTwoFactorServiceContract: ActivateTwoFactorServiceContract;
    resetTwoFactorServiceContract: ResetTwoFactorServiceContract;
    createUserServiceContract: CreateUserServiceContract;
    deleteUserServiceContract: DeleteUserServiceContract;
    getUserByIdServiceContract: GetUserByIdServiceContract;
    getUsersServiceContract: GetUsersServiceContract;
    logoutUserServiceContract: LogoutUserServiceContract;
    pictureProfileServiceContract: PictureProfileServiceContract;
    resetProfileServiceContract: ResetProfileServiceContract;
    updateEmailServiceContract: UpdateEmailServiceContract;
    updateGameInfoServiceContract: UpdateGameInfoServiceContract;
    updatePasswordServiceContract: UpdatePasswordServiceContract;
    updateSecretQuestionServiceContract: UpdateSecretQuestionServiceContract;
    updateUserServiceContract: UpdateUserServiceContract;
    verifyEmailServiceContract: VerifyEmailServiceContract;
    loginUserServiceContract: LoginUserServiceContract;
}
