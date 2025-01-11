import sinon from 'sinon';
import UpdateSecretQuestionOperation from 'src/core/users/operations/users/UpdateSecretQuestionOperation';
import { UserSecretQuestion } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Operations :: UpdateSecretQuestionOperation', () => {
    let updateSecretQuestionOperation: UpdateSecretQuestionOperation,
        updateSecretQuestionService: any,
        userDetails: any,
        newQuestion: UserSecretQuestion,
        payload: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            newQuestion = {
                question: 'newQuestion',
                answer: 'newAnswer',
            };

            updateSecretQuestionService = {
                update: sinon.spy(() => ({ userDetails })),
                save: sinon.spy(() => ({ newQuestion })),
            };

            payload = {
                question: 'oldQuestion',
                answer: 'oldAnswer',
                new: newQuestion,
            };

            updateSecretQuestionOperation = new UpdateSecretQuestionOperation({
                updateSecretQuestionService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await updateSecretQuestionOperation.execute({
                userId: '123',
                payload,
            });

            expect(updateSecretQuestionService.update).to.have.been.called();
            expect(updateSecretQuestionService.save).to.have.been.called();
        });
    });
});
