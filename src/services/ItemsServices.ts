import ItemsModel from 'src/database/models/ItemsModel';
import Service from 'src/types/Service';
import ItemZodSchema, { Item } from 'src/schemas/itemsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';

export default class ItemsServices
  extends ValidateEntry
  implements Service<Internacional<Item>> {
  constructor(private readonly _model: ItemsModel) {
    super();
  }

  public async findAll(): Promise<Array<Internacional<Item>>> {
    const response = await this._model.findAll();
    return response;
  };

  public async findOne(_id: string): Promise<Internacional<Item>> {
    const response = await this._model.findOne(_id);

    if (!response) {
      const err = new Error('NotFound a Item with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }
    return response;
  }

  public async update(_id: string, payload: Internacional<Item>): Promise<Internacional<Item>> {
    this.validate(languagesWrapper(ItemZodSchema), payload);

    const response = await this._model.update(_id, payload);

    if (!response) {
      const err = new Error('NotFound a Item with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    return response;
  }

  public async delete(_id: string): Promise<void> {
    const response = await this._model.findOne(_id);

    if (!response) {
      const err = new Error('NotFound a Item with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    await this._model.delete(_id);
  };
}