import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import { Logger } from 'src/types/Logger';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { SchemasDnDType } from 'src/schemas';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

export default class ItemsServices implements Service<Internacional<Item>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Item>>,
        private readonly _logger: Logger,
        private readonly _validate: SchemaValidator,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<Item>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Item>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Item>> {
        const response = (await this._model.findOne(_id)) as Internacional<Item>;

        this._logger('info', 'Item entity found with success');
        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        return response;
    }

    public async update(_id: string, payload: Internacional<Item>): Promise<Internacional<Item>> {
        const { helpers, itemZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(itemZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = (await this._model.update(_id, payload)) as Internacional<Item>;

        this._logger('info', 'Item entity updated with success');
        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = (await this._model.findOne(_id)) as Internacional<Item>;

        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Item ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Item entity availability updated with success');
        return responseMessage;
    }
}
