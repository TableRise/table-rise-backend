import MonstersModel from 'src/database/models/MonstersModel';
import Service from 'src/types/Service';
import monstersZodSchema, { Monster } from 'src/schemas/monstersValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateData';

export default class MonstersService extends ValidateEntry implements Service<Internacional<Monster>> {
    constructor(private readonly _model: MonstersModel) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Monster>>> {
        const response = await this._model.findAll();
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Monster>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a monster with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async update(_id: string, payload: Internacional<Monster>): Promise<Internacional<Monster>> {
        this.validate(languagesWrapper(monstersZodSchema), payload);

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a monster with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a monster with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        await this._model.delete(_id);
    }
}
