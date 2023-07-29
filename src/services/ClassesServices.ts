import ClassesModel from 'src/database/models/ClassesModel';
import Service from 'src/types/Service';
import classesZodSchema, { Class } from 'src/schemas/classesValidationSchema';
import updateAvailabilityZodSchema, { UpdateAvailability } from 'src/schemas/updateAvailabilitySchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';

export default class ClassesServices extends ValidateEntry implements Service<Internacional<Class>> {
    constructor(private readonly _model: ClassesModel) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Class>>> {
        const response = await this._model.findAll({ active: true });
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Class>>> {
        const response = await this._model.findAll({ active: false });
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Class>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a class with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async update(_id: string, payload: Internacional<Class>): Promise<Internacional<Class>> {
        this.validate(languagesWrapper(classesZodSchema), payload);

        if (payload.active) {
            const err = new Error('Not authorize to change availability');
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            throw err;
        }

        const updatedResponse = await this._model.update(_id, payload);

        if (!updatedResponse) {
            const err = new Error('NotFound a class with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return updatedResponse;
    }

    public async updateAvailability(_id: string, payload: UpdateAvailability): Promise<Internacional<Class>> {
        this.validate(updateAvailabilityZodSchema, payload);

        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a class with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        if (response.active === payload.active) {
            const err = new Error(`${payload.active ? 'Entity already enabled' : 'Entity already disabled'}`);
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            throw err;
        }

        response.active = payload.active;
        const updatedResponse = await this._model.update(_id, response);

        if (!updatedResponse) {
            const err = new Error('NotFound a class with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return updatedResponse;
    }

    // public async delete(_id: string): Promise<void> {
    //     const response = await this._model.findOne(_id);

    //     if (!response) {
    //         const err = new Error('NotFound a class with provided ID');
    //         err.stack = HttpStatusCode.NOT_FOUND.toString();
    //         err.name = 'NotFound';

    //         throw err;
    //     }

    //     await this._model.delete(_id);
    // }
}
