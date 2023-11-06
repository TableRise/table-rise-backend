/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import OAuthController from 'src/interface/users/presentation/oauth/OAuthController';

describe('Interface :: Users :: Presentation :: Oauth :: OAuthController', () => {
    let oauthController: OAuthController,
    googleOperation: any,
    facebookOperation: any,
    discordOperation: any;

    context('#google', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            googleOperation = { execute: sinon.spy(() => ({})) };
            facebookOperation = { execute: () => ({}) };
            discordOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test@email.com' };
            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login', async () => {
            request.user = { email: 'test@email.com' };
            googleOperation = { execute: sinon.spy(() => '123') };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation
            });

            await oauthController.google(request, response);

            expect(googleOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.calledWith({ token: '123' });
        });
    });

    context('#facebook', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            googleOperation = { execute: () => ({}) };
            facebookOperation = { execute: sinon.spy(() => ({})) };
            discordOperation = { execute: () => ({}) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test20@email.com' };
            await oauthController.facebook(request, response);

            expect(facebookOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions - when login', async () => {
            request.user = { email: 'test20@email.com' };
            facebookOperation = { execute: sinon.spy(() => '123') };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation
            });

            await oauthController.facebook(request, response);

            expect(facebookOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.calledWith({ token: '123' });
        });
    });

    context('#discord', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            googleOperation = { execute: () => ({}) };
            facebookOperation = { execute: () => ({}) };
            discordOperation = { execute: sinon.spy(() => ({})) };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.user = { email: 'test20@email.com' };
            discordOperation = { execute: sinon.spy(() => '123') };

            oauthController = new OAuthController({
                googleOperation,
                facebookOperation,
                discordOperation
            });

            await oauthController.discord(request, response);

            expect(discordOperation.execute).to.have.been.calledWith(request.user);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.calledWith({ token: '123' });
        });
    });
});
