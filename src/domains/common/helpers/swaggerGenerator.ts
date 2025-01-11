/* eslint-disable no-console */
import { Router, Request, Response } from 'express';
import autoSwagger from '@tablerise/auto-swagger';
import logger from '@tablerise/dynamic-logger';
import RoutesWrapper from 'src/interface/common/RoutesWrapper';
import swaggerUI from 'swagger-ui-express';

export default ({ routesWrapper }: { routesWrapper: RoutesWrapper }): Router => {
    const router = Router();
    const urls = [process.env.SWAGGER_URL as string];

    if (process.env.NODE_ENV === 'develop') {
        autoSwagger(routesWrapper.declareRoutes()['dungeons&dragons5e'], {
            title: 'dungeons&dragons5e',
            url: urls,
        })
            .then((_result: any) => {
                logger('info', 'Swagger - dungeons&dragons5e - document generated');

                const SwaggerDocumentDnD5E = require('../../../../api-docs/swagger-doc-dungeons&dragons5e.json');

                router.use(
                    '/api-docs/system/dnd5e',
                    swaggerUI.serve,
                    (req: Request, res: Response) => {
                        const html = swaggerUI.generateHTML(SwaggerDocumentDnD5E);
                        res.send(html);
                    }
                );
            })
            .catch((error: any) => {
                console.log(error);
            });

        autoSwagger(routesWrapper.declareRoutes().user, {
            title: 'users',
            url: urls,
        })
            .then((_result: any) => {
                logger('info', 'SwaggerGenerator - user - document generated');

                const SwaggerDocumentUser = require('../../../../api-docs/swagger-doc-users.json');

                router.use(
                    '/api-docs/users',
                    swaggerUI.serve,
                    (req: Request, res: Response) => {
                        const html = swaggerUI.generateHTML(SwaggerDocumentUser);
                        res.send(html);
                    }
                );
            })
            .catch((error: any) => {
                console.log(error);
            });

        autoSwagger(routesWrapper.declareRoutes().campaign, {
            title: 'campaigns',
            url: urls,
        })
            .then((_result: any) => {
                logger('info', 'SwaggerGenerator - campaign - document generated');

                const SwaggerDocumentCampaign = require('../../../../api-docs/swagger-doc-campaigns.json');

                router.use(
                    '/api-docs/campaigns',
                    swaggerUI.serve,
                    (req: Request, res: Response) => {
                        const html = swaggerUI.generateHTML(SwaggerDocumentCampaign);
                        res.send(html);
                    }
                );
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    return router;
};
