import { NextFunction, Request, Response } from 'express';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { VerifyEmailCodeMiddlewareContract } from 'src/types/users/contracts/middlewares/VerifyEmailCodeMiddleware';

export default class VerifyEmailCodeMiddleware {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: VerifyEmailCodeMiddlewareContract) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.verify = this.verify.bind(this);
    }

    public async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'Verify - VerifyEmailCodeMiddleware');
        const { id } = req.params;
        const { email, code } = req.query;

        let userInDb = {} as UserInstance;

        if (!id && !email)
            throw new HttpRequestErrors({
                message: 'Neither id or email was provided to validate the email code',
                code: HttpStatusCode.BAD_REQUEST,
                name: 'BadRequest',
            });

        if (id) userInDb = await this._usersRepository.findOne({ userId: id });
        if (email) userInDb = await this._usersRepository.findOne({ email });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        if (code !== userInDb.inProgress.code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        next();
    }
}