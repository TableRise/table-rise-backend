import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import UsersServices from 'src/services/user/UsersServices';
import { RegisterUserPayload } from 'src/types/Response';

export default class UsersControllers {
    constructor(
        private readonly _service: UsersServices,
        private readonly _logger: Logger
    ) {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
    }

    public async register(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to register a new user');

        const payload = req.body as RegisterUserPayload;

        const request = await this._service.register(payload);
        return res.status(HttpStatusCode.CREATED).json(request);
    }

    public async login(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'User successfully logged in');

        const { user: token } = req;

        return res.status(HttpStatusCode.OK).json({
            token,
        });
    }

    public async confirmCode(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to confirm the verification code');

        const { id: _id } = req.params;
        const { code } = req.query;

        const request = await this._service.confirmCode(_id, code as string);

        return res.status(HttpStatusCode.OK).json(request);
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to delete a user');

        const { id: _id } = req.params;
        const { code } = req.query;

        await this._service.delete(_id, code as string);

        return res.status(HttpStatusCode.DELETED);
    }
}
