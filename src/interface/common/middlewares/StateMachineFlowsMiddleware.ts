import { NextFunction, Request, Response } from 'express';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class StateMachineFlowsMiddleware {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        logger,
    }: InterfaceDependencies['stateMachineFlowsMiddlewareContract']) {
        this._usersRepository = usersRepository;
        this._logger = logger;
    }

    public async setNewFlow(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'SetNewFlow - StateMachineFlowsMiddleware');

        const { id } = req.params;
        const { email, flow } = req.query;

        let userInDb = {} as UserInstance;

        if (id && !email) userInDb = await this._usersRepository.findOne({ userId: id });
        if (email && !userInDb.email)
            userInDb = await this._usersRepository.findOne({ email });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        userInDb.inProgress.currentFlow = flow as stateFlowsKeys;

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });
    }
}
