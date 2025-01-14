import { NextFunction, Request, Response } from 'express';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import { UserSecretQuestion } from 'src/domains/users/schemas/userDetailsValidationSchema';

export default class VerifyEmailCodeMiddleware {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _logger;
    private readonly _ALLOWED_STATUS;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        logger,
    }: InterfaceDependencies['verifyEmailCodeMiddlewareContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this._ALLOWED_STATUS = [
            stateMachine.props.status.DONE,
            stateMachine.props.status.WAIT_TO_CONFIRM,
            stateMachine.props.status.WAIT_TO_START_EMAIL_CHANGE,
            stateMachine.props.status.WAIT_TO_START_PASSWORD_CHANGE,
            stateMachine.props.status.WAIT_TO_START_RESET_TWO_FACTOR,
        ];

        this.verify = this.verify.bind(this);
    }

    private async _getUserToValidate(id: string, email: string): Promise<UserInstance> {
        if (!id && !email)
            throw new HttpRequestErrors({
                message: 'Neither id or email was provided to validate the email code',
                code: HttpStatusCode.BAD_REQUEST,
                name: 'BadRequest',
            });

        if (id) {
            const userInDb = await this._usersRepository.findOne({ userId: id });

            return userInDb;
        }

        const userInDb = await this._usersRepository.findOne({ email });

        return userInDb;
    }

    public async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'Verify - VerifyEmailCodeMiddleware');

        const { id } = req.params;
        const { email, code, flow } = req.query;

        this._logger('info', `Code from Request is = ${code as string}`);

        const userRepository = await this._getUserToValidate(id, email as string);

        this._logger('info', `Code in Database is = ${userRepository.inProgress.code}`);
        this._logger('info', `User status = ${userRepository.inProgress.status}`);

        if (!this._ALLOWED_STATUS.includes(userRepository.inProgress.status))
            HttpRequestErrors.throwError('invalid-user-status');

        if (code !== userRepository.inProgress.code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        const userVerified = await this._stateMachine.machine(
            flow as stateFlowsKeys,
            userRepository
        );

        let userDetails: any;

        try {
            const result = await this._usersDetailsRepository.findOne({
                userId: userRepository.userId,
            });

            userDetails = result;
        } catch (error) {
            userDetails = { secretQuestion: '' };
        }

        res.locals = {
            userId: userVerified.userId,
            userStatus: userVerified.inProgress.status,
            accountSecurityMethod: !userVerified.twoFactorSecret.active
                ? `secret-question%${
                      (userDetails.secretQuestion as UserSecretQuestion).question
                  }`
                : 'two-factor',
            lastUpdate: userVerified.updatedAt,
        };

        next();
    }
}
