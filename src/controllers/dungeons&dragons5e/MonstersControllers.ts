import { Request, Response } from 'express';
import MonstersServices from 'src/services/dungeons&dragons5e/MonstersServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Monster } from 'src/schemas/monstersValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';

export default class MonstersControllers {
    constructor(
        private readonly _service: MonstersServices,
        private readonly _logger: LoggerType
    ) {
        this.findAll = this.findAll.bind(this);
        this.findAllDisabled = this.findAllDisabled.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.updateAvailability = this.updateAvailability.bind(this);
    }

    public async findAll(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAll] made to monsters');
        const request = await this._service.findAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findAllDisabled(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAllDisable] made to monsters');
        const request = await this._service.findAllDisabled();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findOne(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findOne] made to monsters');
        const { id: _id } = req.params;

        const request = await this._service.findOne(_id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [update] made to monsters');
        const { id: _id } = req.params;
        const payload = req.body as Internacional<Monster>;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async updateAvailability(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [updateAvailability] made to monsters');
        const { id: _id } = req.params;
        const { availability } = req.query;
        const query = availability === 'true';

        const request = await this._service.updateAvailability(_id, query);
        return res.status(HttpStatusCode.OK).json(request);
    }
}