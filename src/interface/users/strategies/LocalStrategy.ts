/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import passport from 'passport';
import Local from 'passport-local';
import { ZodError, ZodIssue } from 'zod';

import { userLoginZodSchema } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import logger from '@tablerise/dynamic-logger';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';

const NOT_ALLOWED_STATUS_TO_LOGIN = ['wait-to-confirm', 'wait-to-delete-user'];
const LocalStrategy = Local.Strategy;

export default class LoginPassport {
    private readonly _schemaValidator;
    private readonly _usersRepository;

    constructor({ schemaValidator, usersRepository }: any) {
        this._schemaValidator = schemaValidator;
        this._usersRepository = usersRepository;
    }

    localStrategy(): void {
        passport.use(
            new LocalStrategy(
                {
                    usernameField: 'email',
                    session: false,
                },
                async (email, password, done) => {
                    logger('warn', 'LocalStrategy used to login the user');

                    const isDataInvalid = this._schemaValidator.entryReturn(
                        userLoginZodSchema,
                        {
                            email,
                            password,
                        }
                    ) as ZodError;

                    if (isDataInvalid)
                        return done(
                            new HttpRequestErrors({
                                message: 'Schema error',
                                code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                                name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                                // @ts-expect-error Error will exist with sure
                                details: isDataInvalid.error.issues.map(
                                    (err: ZodIssue) => ({
                                        attribute:
                                            err.path.length > 1 ? err.path : err.path[0],
                                        reason: err.message,
                                        path: 'payload',
                                    })
                                ),
                            })
                        );

                    try {
                        const user = await this._usersRepository.findOne({ email });

                        if (!user)
                            return done(
                                new HttpRequestErrors({
                                    message: 'Incorrect email or password. Try again.',
                                    code: HttpStatusCode.NOT_FOUND,
                                    name: getErrorName(HttpStatusCode.NOT_FOUND),
                                })
                            );

                        const isPasswordValid =
                            await SecurePasswordHandler.comparePassword(
                                password,
                                user.password
                            );

                        if (!isPasswordValid)
                            return done(
                                new HttpRequestErrors({
                                    message: 'Incorrect email or password. Try again.',
                                    code: HttpStatusCode.UNAUTHORIZED,
                                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                                })
                            );

                        if (NOT_ALLOWED_STATUS_TO_LOGIN.includes(user.inProgress.status))
                            return done(
                                new HttpRequestErrors({
                                    message:
                                        'User status is invalid to perform this operation',
                                    code: HttpStatusCode.BAD_REQUEST,
                                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                                })
                            );

                        const token = JWTGenerator.generate(user);

                        done(null, { token } as Express.User);
                    } catch (error) {
                        return done(error);
                    }
                }
            )
        );
    }
}
