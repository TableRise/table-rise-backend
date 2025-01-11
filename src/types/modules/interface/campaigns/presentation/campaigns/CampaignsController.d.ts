import GetCampaignByIdOperation from 'src/core/campaigns/operations/campaigns/GetCampaignByIdOperation';
import createCampaignOperation from 'src/core/campaigns/operations/campaigns/CreateCampaignOperation';
import GetAllCampaignsOperation from 'src/core/campaigns/operations/campaigns/GetAllCampaignsOperation';
import UpdateMatchMapImagesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMapImagesOperation';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMusicsOperation';
import UpdateCampaignOperation from 'src/core/campaigns/operations/campaigns/UpdateCampaignOperation';
import UpdateMatchDatesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchDatesOperation';
import PublishmentOperation from 'src/core/campaigns/operations/campaigns/PublishmentOperation';
import AddMatchPlayersOperation from 'src/core/campaigns/operations/campaigns/AddMatchPlayersOperation';
import RemoveMatchPlayersOperation from 'src/core/campaigns/operations/campaigns/RemoveMatchPlayersOperation';
import PostInvitationEmailOperation from 'src/core/campaigns/operations/PostInvitationEmailOperation';
import UpdateCampaignImagesOperation from 'src/core/campaigns/operations/UpdateCampaignImagesOperation';

export interface CampaignsControllerContract {
    getAllCampaignsOperation: GetAllCampaignsOperation;
    getCampaignByIdOperation: GetCampaignByIdOperation;
    publishmentOperation: PublishmentOperation;
    createCampaignOperation: createCampaignOperation;
    updateCampaignOperation: UpdateCampaignOperation;
    updateMatchMapImagesOperation: UpdateMatchMapImagesOperation;
    updateMatchMusicsOperation: UpdateMatchMusicsOperation;
    updateMatchDatesOperation: UpdateMatchDatesOperation;
    addMatchPlayersOperation: AddMatchPlayersOperation;
    removeMatchPlayersOperation: RemoveMatchPlayersOperation;
    postInvitationEmailOperation: PostInvitationEmailOperation;
    updateCampaignImagesOperation: UpdateCampaignImagesOperation;
}
