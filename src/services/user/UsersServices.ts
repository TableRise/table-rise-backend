import { MongoModel } from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';
import ValidateData from 'src/support/helpers/ValidateData';
import { RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { SchemasUserType } from 'src/schemas';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';

export default class RegisterServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasUserType
    ) {}

    private _cryptographer(param: any): any {
        return param;
    }

    public async register(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
        const { details: userDetails, ...user } = payload;
        this._validate.entry(this._schema.userZod, user);
        this._validate.entry(this._schema.userDetailZod, userDetails);

        const emailAlreadyExist = await this._model.findAll({ email: user.email });

        if (emailAlreadyExist.length) {
            const errMessage = 'Email already exists in database';
            this._logger('info', errMessage);

            const err = new Error(errMessage);
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';
            throw err;
        }

        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagAlreadyExist = await this._model.findAll({ tag, nickname: user.nickname });

        if (tagAlreadyExist.length) {
            const errMessage = 'User already exists in database';
            this._logger('info', errMessage);

            const err = new Error(errMessage);
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';
            throw err;
        }

        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const passwordHashed = this._cryptographer(user.password);

        const userToRegister = {
            ...user,
            password: passwordHashed,
            tag,
            createdAt,
            updatedAt,
        };

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userToRegister);
        this._logger('info', 'User saved on database');

        const userDetailsToRegister = {
            ...userDetails,
            userId: userRegistered._id,
        };

        const userDetailsRegistered = await this._modelDetails.create(userDetailsToRegister);
        this._logger('info', 'User details saved on database');

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }
}