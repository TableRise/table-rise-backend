import Discord from 'passport-discord';
import Facebook from 'passport-facebook';
import Google from 'passport-google-oauth20';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import {
    DiscordJSONPayload,
    FacebookJSONPayload,
    GoogleJSONPayload,
    UserDetailJSONPayload,
    UserJSONPayload,
} from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import generateUsersFaker from './generators/generateUsersFaker';
import generateUserDetailsFaker from './generators/generateUserDetailsFaker';
import questionEnum from 'src/domains/users/enums/questionEnum';
import generateDiscordProfileFaker from './generators/generateDiscordFaker';
import generateFacebookProfileFaker from './generators/generateFacebookFaker';
import generateGoogleProfileFaker from './generators/generateGoogleFaker';

function generateUsersJSON(
    { count, userId }: UserJSONPayload = { count: 1 }
): UserInstance[] {
    return generateUsersFaker({ count, userId });
}

function generateUserDetailsJSON(
    { count, userDetailId }: UserDetailJSONPayload = { count: 1 }
): UserDetailInstance[] {
    return generateUserDetailsFaker({ count, userDetailId });
}

function generateDiscordProfileJSON(
    { count, username }: DiscordJSONPayload = { count: 1 }
): Discord.Profile[] {
    return generateDiscordProfileFaker({ count, username });
}

function generateFacebookProfileJSON(
    { count, id }: FacebookJSONPayload = { count: 1 }
): Facebook.Profile[] {
    return generateFacebookProfileFaker({ count, id });
}

function generateGoogleProfileJSON(
    { count, id }: GoogleJSONPayload = { count: 1 }
): Google.Profile[] {
    return generateGoogleProfileFaker({ count, id });
}

const [{ email, password, nickname }] = generateUsersJSON();
const [{ firstName, lastName, pronoun, birthday, biography }] = generateUserDetailsJSON();

const mocks = {
    loginMock: { email, password },
    createUserMock: {
        email,
        password,
        nickname,
    },
    completeUserMock: {
        nickname,
        firstName,
        lastName,
        pronoun,
        birthday,
    },
    updateUserMock: {
        nickname,
        details: {
            firstName,
            lastName,
            pronoun,
            birthday,
            biography,
        },
    },
    updateEmailMock: { email },
    updatePasswordMock: { password: '@TheWorld456' },
    uploadPicture: { picture: { isBinary: true } },
    activateSecretQuestionMock: {
        question: questionEnum.enum.WHAT_IS_YOUR_GRANDFATHER_LAST_NAME,
        answer: 'Silvera',
    },
    updateSecretQuestionMock: {
        question: questionEnum.enum.WHAT_COLOR_DO_YOU_LIKE_THE_MOST,
        answer: 'black',
        new: {
            question: questionEnum.enum.WHAT_IS_YOUR_GRANDFATHER_LAST_NAME,
            answer: 'Silvera',
        },
    },
};

export default {
    generateUsersJSON,
    generateUserDetailsJSON,
    generateDiscordProfileJSON,
    generateFacebookProfileJSON,
    generateGoogleProfileJSON,
    mocks,
};
