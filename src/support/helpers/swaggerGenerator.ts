/* eslint-disable no-console */
import { Router, Request, Response } from 'express';
import autoSwagger from '@tablerise/auto-swagger';
import logger from '@tablerise/dynamic-logger';
import RoutesWrapper from 'src/routes/RoutesWrapper';
import swaggerUI from 'swagger-ui-express';
// import SwaggerDocumentDnD5E from '../../../api-docs/swagger-doc-dungeons&dragons5e.json';
import SwaggerDocumentUser from '../../../api-docs/swagger-doc-user.json';

export default (env: string): Router => {
    const router = Router();

    if (env === 'develop') {
        // autoSwagger(RoutesWrapper.declareRoutes()['dungeons&dragons5e'], { title: 'dungeons&dragons5e' })
        //     .then((_result: any) => {
        //         logger('info', 'Swagger - dungeons&dragons5e - document generated');
        //     })
        //     .catch((error: any) => {
        //         console.log(error);
        //     });

        autoSwagger(RoutesWrapper.declareRoutes().user, { title: 'user' })
            .then((_result: any) => {
                logger('info', 'Swagger - user - document generated');
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    // router.use('/api-docs/dnd5e', swaggerUI.serve, (req: Request, res: Response) => {
    //     const html = swaggerUI.generateHTML(SwaggerDocumentDnD5E);
    //     res.send(html);
    // });
    router.use('/api-docs/user', swaggerUI.serve, (req: Request, res: Response) => {
        const html = swaggerUI.generateHTML(SwaggerDocumentUser);
        res.send(html);
    });

    return router;
};
