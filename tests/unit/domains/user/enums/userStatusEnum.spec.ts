import userStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

describe('Domains :: User :: Enum :: UserStatusEnum', () => {
    const enumKeysFixed = [
        'WAIT_FOR_NEW_FLOW',
        'WAIT_TO_CONFIRM',
        'WAIT_TO_COMPLETE',
        'WAIT_TO_VERIFY',
        'WAIT_TO_CHANGE_EMAIL',
        'WAIT_TO_START_PASSWORD_CHANGE',
        'WAIT_TO_FINISH_PASSWORD_CHANGE',
        'WAIT_TO_DELETE_USER',
        'WAIT_TO_SECRET_QUESTION',
        'WAIT_TO_SECOND_AUTH',
        'WAIT_TO_ACTIVATE_SECRET_QUESTION',
        'WAIT_TO_UPDATE_SECRET_QUESTION',
        'WAIT_TO_ACTIVATE_TWO_FACTOR',
        'WAIT_TO_START_RESET_TWO_FACTOR',
        'WAIT_TO_FINISH_RESET_TWO_FACTOR',
        'WAIT_TO_START_EMAIL_CHANGE',
        'WAIT_TO_FINISH_EMAIL_CHANGE',
        'WAIT_TO_RESET_PROFILE',
        'WAIT_TO_FINISH_DELETE_USER',
        'DONE',
    ];
    const enumValuesFixed = [
        'wait-for-new-flow',
        'wait-to-confirm',
        'wait-to-complete',
        'wait-to-verify',
        'wait-to-change-email',
        'wait-to-start-password-change',
        'wait-to-finish-password-change',
        'wait-to-delete-user',
        'wait-to-secret-question',
        'wait-to-second-auth',
        'wait-to-activate-secret-question',
        'wait-to-update-secret-question',
        'wait-to-activate-two-factor',
        'wait-to-start-reset-two-factor',
        'wait-to-finish-reset-two-factor',
        'wait-to-start-email-change',
        'wait-to-finish-email-change',
        'wait-to-reset-profile',
        'wait-to-finish-delete-user',
        'done',
    ];

    context('When enum key/values', () => {
        it('should have correct key/values', () => {
            const enumTest = userStatusEnum.enum;

            enumKeysFixed.forEach((key: string, index: number) => {
                expect(enumTest).to.have.property(key);
                expect(enumTest[key as keyof typeof enumTest]).to.be.equal(
                    enumValuesFixed[index]
                );
            });
        });
    });

    context('When enum values', () => {
        it('should have correct key/values', () => {
            const enumTest = userStatusEnum.values;

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});
