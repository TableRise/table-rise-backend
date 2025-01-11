import sinon from 'sinon';
import VerifyEmailOperation from 'src/core/users/operations/users/VerifyEmailOperation';

describe('Core :: Users :: Operations :: VerifyEmailOperation', () => {
    let verifyEmailOperation: VerifyEmailOperation,
        verifyEmailService: any,
        payload: any,
        schemaValidator: any;

    const logger = (): void => {};

    context('When get users with success', () => {
        before(() => {
            verifyEmailService = {
                sendEmail: sinon.spy(() => ({})),
            };

            payload = {
                email: 'oldEmail',
                newEmail: 'newEmail',
            };

            schemaValidator = { entry: () => {} };

            verifyEmailOperation = new VerifyEmailOperation({
                verifyEmailService,
                schemaValidator,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            await verifyEmailOperation.execute(payload);

            expect(verifyEmailService.sendEmail).to.have.been.called();
        });
    });
});
