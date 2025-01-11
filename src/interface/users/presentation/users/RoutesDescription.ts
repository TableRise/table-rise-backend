const getAll = 'This route returns all users registered in database';

const get = 'Route to recovery of one user';

const verify = `This route receives an userId and send an email to verify the user.\n
The user status is changed and is necessary to confirm the email using the code sent in the email message to perform any further operations.`;

const register =
    'Route for user registration, after register email confirmation is needed.';

const login = 'Route for user login';

const update = 'Route for update user but only allowed fields.';

const activateQuestion = 'Activate the secretQuestion - 2FA will be disabled';

const updateSecretQuestion = ' Route for update user Secret Question.';

const confirm = `This route must be used to confirm an account that was recently created the route receives the param "code", that was send to the user email in the signup.`;

const activate2FA = 'Route for 2FA activation';

const reset2FA = 'Route for 2FA reset';

const updateEmail = `Route for email update, verification code send to user email is needed.\n
If the user has 2FA enabled the 2FA token will be needed as well.`;

const updatePassword =
    'Route to perform the password reset operation, receives an email code and 2FA or secret question if enabled.';

const updateGameInfo = `Route to update user game info.\n
------------------------
Params:
- userId: expects an user id.\n
Query:
- id: content id to add or remove
- info: "badges" | "campaigns" | "characters"
- operation: "add" | "remove"`;

const resetProfile = `Route for user reset, this route erase all the content in: characters - campaigns - badges`;

const profilePicture =
    'Route used to upload a photo as profile ficture - Only PNG or JPEG';

const deleteProfile =
    'Route for user deletion, if the user has 2FA enabled the 2FA token will be needed, if not the secret question will be needed.';

const logoutUser =
    'Route for logout of an user and addition of token in a forbidden list';

const emailCode = 'Route to verify email code sent to user';

const token2FA = 'Route to verify user two factor authentication';

const secretQuestion = 'Route to verify user secret question authentication';

export default {
    get,
    getAll,
    register,
    verify,
    login,
    update,
    activate2FA,
    reset2FA,
    activateQuestion,
    updateSecretQuestion,
    confirm,
    updateEmail,
    updatePassword,
    updateGameInfo,
    resetProfile,
    profilePicture,
    deleteProfile,
    logoutUser,
    emailCode,
    token2FA,
    secretQuestion,
};
