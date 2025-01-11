import 'express-async-errors';

import express from 'express';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import { ApplicationContract } from 'src/types/modules/core/Application';
import DatabaseManagement from '@tablerise/database-management';
import { createServer } from 'http';

export default class Application {
    private readonly _dungeonsAndDragonsRoutesMiddleware;
    private readonly _usersRoutesMiddleware;
    private readonly _campaignsRoutesMiddleware;
    private readonly _swaggerGenerator;
    private readonly _accessHeadersMiddleware;
    private readonly _errorMiddleware;
    private readonly _socketIO;
    private readonly _logger;
    private readonly _managerCronJob;

    constructor({
        dungeonsAndDragonsRoutesMiddleware,
        usersRoutesMiddleware,
        campaignsRoutesMiddleware,
        errorMiddleware,
        swaggerGenerator,
        accessHeadersMiddleware,
        socketIO,
        logger,
        managerCronJob,
    }: ApplicationContract) {
        this._dungeonsAndDragonsRoutesMiddleware = dungeonsAndDragonsRoutesMiddleware;
        this._usersRoutesMiddleware = usersRoutesMiddleware;
        this._campaignsRoutesMiddleware = campaignsRoutesMiddleware;
        this._swaggerGenerator = swaggerGenerator;
        this._accessHeadersMiddleware = accessHeadersMiddleware;
        this._errorMiddleware = errorMiddleware;
        this._socketIO = socketIO;
        this._logger = logger;
        this._managerCronJob = managerCronJob;
    }

    public setupExpress(): express.Application {
        const app = express();

        app.use(express.json())
            .use(
                cors({
                    origin: process.env.CORS_ORIGIN,
                    credentials: true,
                })
            )
            .use(
                session({
                    secret: (process.env.COOKIE_SECRET as string) || 'catfish',
                })
            )
            .use(passport.initialize())
            .use(passport.session())
            .use(cookieParser(process.env.COOKIE_SECRET))
            .use(helmet())
            .use(this._accessHeadersMiddleware)
            .use('/health', (req, res) => res.send('OK!'))
            .use(this._swaggerGenerator)
            .use(this._usersRoutesMiddleware.get())
            .use(this._campaignsRoutesMiddleware.get())
            .use(this._dungeonsAndDragonsRoutesMiddleware.get())
            .use(this._errorMiddleware);

        return app;
    }

    public async start(): Promise<void> {
        const port = process.env.PORT as string;
        const app = this.setupExpress();
        const server = createServer(app);

        await this._socketIO.connect(server);
        await this._managerCronJob.run();

        await DatabaseManagement.connect(true, 'mongoose')
            .then(() => {
                this._logger(
                    'info',
                    '[ Application - Database connection instanciated ]',
                    true
                );
            })
            .catch(() => {
                this._logger('error', '[ Application - Database connection failed ]');
            });

        server.listen(port, () => {
            this._logger(
                'info',
                `[ Application - Server started in port -> ${port} ]`,
                true
            );
        });
    }
}
