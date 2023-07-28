import { Request, Response } from 'express';
import SpellsServices from 'src/services/SpellsServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Spell } from 'src/schemas/spellsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

export default class SpellsControllers {
    constructor(readonly _service: SpellsServices) {
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async findAll(_req: Request, res: Response): Promise<Response> {
        const request = await this._service.findAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findOne(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.params;

        const request = await this._service.findOne(_id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.params;
        const payload = req.body as Internacional<Spell>;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.params;

        await this._service.delete(_id);
        return res.status(HttpStatusCode.DELETED).end();
    }
}
