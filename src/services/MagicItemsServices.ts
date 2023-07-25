import MagicItemsModel from 'src/database/models/MagicItemsModel';
import Service from 'src/types/Service';
import magicItemZodSchema, { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';

export default class MagicItemsServices extends ValidateEntry implements Service<Internacional<MagicItem>> {
    constructor(private readonly _model: MagicItemsModel) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<MagicItem>>> {
        const response = await this._model.findAll();
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<MagicItem>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a magic item with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async update(_id: string, payload: Internacional<MagicItem>): Promise<Internacional<MagicItem>> {
        this.validate(languagesWrapper(magicItemZodSchema), payload);

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a magic item with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a magic item with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        await this._model.delete(_id);
    }
}