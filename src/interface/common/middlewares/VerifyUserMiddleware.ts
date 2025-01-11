import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class VerifyUserMiddleware {
    private readonly _usersRepository;
    private readonly _stateMachine;
    private readonly _logger;
    private readonly _FORBIDDEN_STATUS;

    constructor({
        usersRepository,
        stateMachine,
        logger,
    }: InterfaceDependencies['verifyUserMiddlewareContract']) {
        this._usersRepository = usersRepository;
        this._stateMachine = stateMachine;
        this._logger = logger;

        this._FORBIDDEN_STATUS = [
            this._stateMachine.props.status.WAIT_TO_CONFIRM,
            this._stateMachine.props.status.WAIT_TO_DELETE_USER,
            this._stateMachine.props.status.WAIT_TO_COMPLETE,
        ];

        this.userStatus = this.userStatus.bind(this);
    }

    public async userStatus(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('info', 'UserStatus - VerifyUserMiddleware');

        const { userId } = req.user as Express.User;

        const userInDb = await this._usersRepository.findOne({ userId });

        try {
            if (this._FORBIDDEN_STATUS.includes(userInDb.inProgress.status))
                HttpRequestErrors.throwError('invalid-user-status');

            next();
        } catch (error: HttpRequestErrors | any) {
            error.details = {
                attribute: 'status',
                path: userInDb.inProgress.status,
                reason: `Wrong status - ${userInDb.inProgress.status}`,
            };

            throw error;
        }
    }
}
