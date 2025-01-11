import { NextFunction, Request, Response } from 'express';
import {
    UserDetailInstance,
    UserSecretQuestion,
} from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';

export default class AuthorizationMiddleware {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _twoFactorHandler;
    private readonly _logger;
    private readonly _ALLOWED_STATUS;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        twoFactorHandler,
        logger,
    }: InterfaceDependencies['authorizationMiddlewareContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._twoFactorHandler = twoFactorHandler;
        this._logger = logger;

        this._ALLOWED_STATUS = [
            stateMachine.props.status.DONE,
            stateMachine.props.status.WAIT_TO_SECOND_AUTH,
        ];

        this.checkAdminRole = this.checkAdminRole.bind(this);
        this.twoFactor = this.twoFactor.bind(this);
        this.secretQuestion = this.secretQuestion.bind(this);
    }

    public async checkAdminRole(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'CheckAdminRole - AuthorizationMiddleware');

        const { userId } = req.user as Express.User;

        const userDetail = await this._usersDetailsRepository.findOne({ userId });

        if (!userDetail) HttpRequestErrors.throwError('user-inexistent');

        if (userDetail.role === 'admin') {
            next();
        } else {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'TwoFactor - AuthorizationMiddleware');

        const { id } = req.params;
        const { token, email, flow } = req.query;

        let userInDb = {} as UserInstance;

        if (id && !email) userInDb = await this._usersRepository.findOne({ userId: id });
        if (email && !userInDb.email)
            userInDb = await this._usersRepository.findOne({ email });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        if (!userInDb.twoFactorSecret.active) {
            HttpRequestErrors.throwError('2fa-no-active');
        }

        if (!this._ALLOWED_STATUS.includes(userInDb.inProgress.status))
            HttpRequestErrors.throwError('invalid-user-status');

        const validateSecret = this._twoFactorHandler.validate({
            secret: userInDb.twoFactorSecret.secret as string,
            token: token as string,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        const userAuthorized = await this._stateMachine.machine(
            flow as stateFlowsKeys,
            userInDb
        );

        res.locals = {
            userId: userAuthorized.userId,
            userStatus: userAuthorized.inProgress.status,
            accountSecurityMethod: 'two-factor',
            lastUpdate: userAuthorized.updatedAt,
        };

        next();
    }

    public async secretQuestion(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'SecretQuestion - AuthorizationMiddleware');

        const { id } = req.params;
        const { email, flow } = req.query;

        const payload = (req.body as UserSecretQuestion) || {};
        const query = req.query as UserSecretQuestion;

        let userDetailsInDb = {} as UserDetailInstance;
        let userInDb = {} as UserInstance;

        if (id) {
            userDetailsInDb = await this._usersDetailsRepository.findOne({ userId: id });
            userInDb = await this._usersRepository.findOne({ userId: id });
        }

        if (email && !id) {
            userInDb = await this._usersRepository.findOne({ email });
            userDetailsInDb = await this._usersDetailsRepository.findOne({
                userId: userInDb.userId,
            });
        }

        if (!userDetailsInDb.secretQuestion) {
            next();
            return;
        }

        if (!this._ALLOWED_STATUS.includes(userInDb.inProgress.status))
            HttpRequestErrors.throwError('invalid-user-status');

        const question = payload.question || query.question;
        const answer = payload.answer || query.answer;

        if (question !== userDetailsInDb.secretQuestion.question)
            HttpRequestErrors.throwError('incorrect-secret-question');
        if (answer !== userDetailsInDb.secretQuestion.answer)
            HttpRequestErrors.throwError('incorrect-secret-question');

        const userAuthorized = await this._stateMachine.machine(
            flow as stateFlowsKeys,
            userInDb
        );

        res.locals = {
            userId: userAuthorized.userId,
            userStatus: userAuthorized.inProgress.status,
            accountSecurityMethod: 'secret-question',
            lastUpdate: userAuthorized.updatedAt,
        };

        next();
    }
}
