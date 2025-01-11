import passport from 'passport';
import Google from 'passport-google-oauth20';
import { Express } from 'express';

const GoogleStrategy = Google.Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.use(
    new GoogleStrategy(
        {
            clientID: (GOOGLE_CLIENT_ID as string) || 'default',
            clientSecret: (GOOGLE_CLIENT_SECRET as string) || 'secret',
            callbackURL: `${process.env.SWAGGER_URL as string}oauth/google/callback`,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        },
        (request, accessToken, refreshToken, profile, done) => {
            done(null, profile as unknown as Express.User);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user as any);
});
