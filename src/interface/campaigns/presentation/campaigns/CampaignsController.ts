import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import {
    CampaignPayload,
    UpdateMatchMusicsPayload,
    // UpdateMatchDatesPayload,
} from 'src/types/api/campaigns/http/payload';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';
import { FileObject } from 'src/types/shared/file';

export default class CampaignsController {
    private readonly _createCampaignOperation;
    private readonly _updateCampaignOperation;
    private readonly _getCampaignByIdOperation;
    private readonly _publishmentOperation;
    private readonly _getAllCampaignsOperation;
    private readonly _updateMatchMusicsOperation;
    private readonly _updateMatchMapImagesOperation;
    private readonly _updateMatchDatesOperation;
    private readonly _updateMatchPlayersOperation;
    private readonly _postInvitationEmailOperation;
    private readonly _postBanPlayerOperation;
    private readonly _updateCampaignImagesOperation;

    constructor({
        getCampaignByIdOperation,
        publishmentOperation,
        createCampaignOperation,
        getAllCampaignsOperation,
        updateCampaignOperation,
        updateMatchMapImagesOperation,
        updateMatchMusicsOperation,
        updateMatchDatesOperation,
        updateMatchPlayersOperation,
        postInvitationEmailOperation,
        postBanPlayerOperation,
        updateCampaignImagesOperation,
    }: CampaignsControllerContract) {
        this._createCampaignOperation = createCampaignOperation;
        this._updateCampaignOperation = updateCampaignOperation;
        this._getCampaignByIdOperation = getCampaignByIdOperation;
        this._publishmentOperation = publishmentOperation;
        this._getAllCampaignsOperation = getAllCampaignsOperation;
        this._updateMatchMapImagesOperation = updateMatchMapImagesOperation;
        this._updateMatchMusicsOperation = updateMatchMusicsOperation;
        this._updateMatchDatesOperation = updateMatchDatesOperation;
        this._updateMatchPlayersOperation = updateMatchPlayersOperation;
        this._postInvitationEmailOperation = postInvitationEmailOperation;
        this._postBanPlayerOperation = postBanPlayerOperation;
        this._updateCampaignImagesOperation = updateCampaignImagesOperation;

        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.publishment = this.publishment.bind(this);
        this.update = this.update.bind(this);
        this.updateMatchMapImages = this.updateMatchMapImages.bind(this);
        this.updateMatchMusics = this.updateMatchMusics.bind(this);
        this.updateMatchDates = this.updateMatchDates.bind(this);
        this.updateMatchPlayers = this.updateMatchPlayers.bind(this);
        this.inviteEmail = this.inviteEmail.bind(this);
        this.updateCampaignImages = this.updateCampaignImages.bind(this);
        this.banPlayer = this.banPlayer.bind(this);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const campaign = req.body as CampaignPayload;
        const { userId } = req.user as Express.User;
        const image = req.file as FileObject;
        const result = await this._createCampaignOperation.execute({
            campaign,
            userId,
            image,
        });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllCampaignsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getCampaignByIdOperation.execute({ campaignId: id });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async publishment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.query as { userId: string };
        const payload = req.body;

        const result = await this._publishmentOperation.execute({
            campaignId: id,
            userId,
            payload,
        });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async inviteEmail(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId, username } = req.user as Express.User;
        const { targetEmail } = req.query as { targetEmail: string };

        await this._postInvitationEmailOperation.execute({
            campaignId: id,
            targetEmail,
            userId,
            username,
        });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async banPlayer(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { playerId } = req.query as { playerId: string };

        await this._postBanPlayerOperation.execute({
            campaignId: id,
            playerId,
        });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updateMatchMapImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { imageId, operation } = req.query as {
            imageId?: string;
            operation: 'add' | 'remove';
        };

        const mapImage = req.file as FileObject;

        const result = await this._updateMatchMapImagesOperation.execute({
            campaignId: id,
            imageId,
            operation,
            mapImage,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateMatchMusics(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { operation } = req.query as { operation: 'add' | 'remove' };
        const { title, youtubeLink } = req.body as UpdateMatchMusicsPayload;

        const result = await this._updateMatchMusicsOperation.execute({
            campaignId: id,
            title,
            operation,
            youtubeLink,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateMatchDates(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { operation, date } = req.query as {
            operation: 'add' | 'remove';
            date: string;
        };

        const result = await this._updateMatchDatesOperation.execute({
            campaignId: id,
            date,
            operation,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateMatchPlayers(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { operation, characterId } = req.query as {
            operation: 'add' | 'remove';
            characterId: string;
        };
        const { userId } = req.user as Express.User;

        const result = await this._updateMatchPlayersOperation.execute({
            campaignId: id,
            userId,
            operation,
            characterId,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body;
        const cover = req.file;

        const result = await this._updateCampaignOperation.execute({
            ...payload,
            cover,
            campaignId: id,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCampaignImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { imageId, name, operation } = req.query as {
            imageId?: string;
            name?: string;
            operation: 'add' | 'remove';
        };

        const image = req.file as FileObject;

        const result = await this._updateCampaignImagesOperation.execute({
            campaignId: id,
            imageId,
            image,
            name,
            operation,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }
}
