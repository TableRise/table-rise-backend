import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';

describe('Interface :: Common :: Middlewares :: ErrorMiddleware', () => {
    context('When an error is thrown', () => {
        const request = {} as Request;
        const response = {} as Response;
        const next = sinon.spy(() => {}) as NextFunction;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.send = sinon.spy(() => response);
            response.redirect = sinon.spy(() => response); // Adicionando o método redirect
        });

        it('should return error 500 - internal', async () => {
            const error = new Error('Internal');
            ErrorMiddleware(error, request, response, next);

            expect(response.status).to.have.been.calledWith(500);
            expect(response.json).to.have.not.been.called();
            expect(response.send).to.have.been.calledWith('Internal');
        });

        it('should return error 422 - business', async () => {
            const error = new HttpRequestErrors({
                message: 'Prop is incorrect',
                name: 'Schema error',
                code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                details: [
                    {
                        attribute: 'prop',
                        path: 'obj.prop',
                        reason: 'prop is undefined',
                    },
                ],
            });

            ErrorMiddleware(error, request, response, next);

            expect(response.status).to.have.been.calledWith(422);
            expect(response.json).to.have.been.called();
        });

        it('should return error 400 - bad request and others', async () => {
            try {
                HttpRequestErrors.throwError('2fa-no-active');
            } catch (error) {
                const err = error as HttpRequestErrors;
                ErrorMiddleware(err, request, response, next);

                expect(response.status).to.have.been.calledWith(400);
                expect(response.json).to.have.been.called();
            }
        });

        it('should redirect to the specified URL when redirectTo is present', async () => {
            const error = new HttpRequestErrors({
                code: 404,
                message: 'Redirecting due to error',
                redirectTo: '/error-page',
            });

            process.env.URL_TO_REDIRECT = 'http://example:3000';

            ErrorMiddleware(error, request, response, next);

            expect(response.redirect).to.have.been.calledWith(
                'http://example:3000/error-page?error=Redirecting due to error'
            );
        });

        it('should redirect to the default URL when redirectTo is present but URL_TO_REDIRECT is not defined', async () => {
            const error = new HttpRequestErrors({
                code: 404,
                message: 'Redirecting due to error',
                redirectTo: '/error-page',
            });

            delete process.env.URL_TO_REDIRECT;

            ErrorMiddleware(error, request, response, next);

            expect(response.redirect).to.have.been.calledWith(
                'http://localhost:3000/error-page?error=Redirecting due to error'
            ); // Verificando redirecionamento padrão
        });
    });
});
