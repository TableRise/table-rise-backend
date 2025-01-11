import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum InProgressStatusEnum {
    WAIT_FOR_NEW_FLOW = 'wait-for-new-flow',
    WAIT_TO_CONFIRM = 'wait-to-confirm',
    WAIT_TO_COMPLETE = 'wait-to-complete',
    WAIT_TO_VERIFY = 'wait-to-verify',
    WAIT_TO_CHANGE_EMAIL = 'wait-to-change-email',
    WAIT_TO_START_PASSWORD_CHANGE = 'wait-to-start-password-change',
    WAIT_TO_FINISH_PASSWORD_CHANGE = 'wait-to-finish-password-change',
    WAIT_TO_DELETE_USER = 'wait-to-delete-user',
    WAIT_TO_SECRET_QUESTION = 'wait-to-secret-question',
    WAIT_TO_SECOND_AUTH = 'wait-to-second-auth',
    WAIT_TO_ACTIVATE_SECRET_QUESTION = 'wait-to-activate-secret-question',
    WAIT_TO_UPDATE_SECRET_QUESTION = 'wait-to-update-secret-question',
    WAIT_TO_ACTIVATE_TWO_FACTOR = 'wait-to-activate-two-factor',
    WAIT_TO_START_RESET_TWO_FACTOR = 'wait-to-start-reset-two-factor',
    WAIT_TO_FINISH_RESET_TWO_FACTOR = 'wait-to-finish-reset-two-factor',
    WAIT_TO_START_EMAIL_CHANGE = 'wait-to-start-email-change',
    WAIT_TO_FINISH_EMAIL_CHANGE = 'wait-to-finish-email-change',
    WAIT_TO_RESET_PROFILE = 'wait-to-reset-profile',
    WAIT_TO_FINISH_DELETE_USER = 'wait-to-finish-delete-user',
    DONE = 'done',
}

export default {
    enum: InProgressStatusEnum,
    values: returnEnumValues(InProgressStatusEnum),
};

export type InProgressStatus = InProgressStatusEnum;
