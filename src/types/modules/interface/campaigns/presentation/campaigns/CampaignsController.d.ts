import GetCampaignByIdOperation from 'src/core/campaigns/operations/campaigns/GetCampaignByIdOperation';
import createCampaignOperation from 'src/core/campaigns/operations/campaigns/CreateCampaignOperation';
import GetAllCampaignsOperation from 'src/core/campaigns/operations/campaigns/GetAllCampaignsOperation';
import UpdateMatchMapImagesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMapImagesOperation';
import UpdateMatchMusicsOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchMusicsOperation';
import UpdateCampaignOperation from 'src/core/campaigns/operations/campaigns/UpdateCampaignOperation';
import UpdateMatchDatesOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchDatesOperation';
import PublishmentOperation from 'src/core/campaigns/operations/campaigns/PublishmentOperation';
import UpdateMatchPlayersOperation from 'src/core/campaigns/operations/campaigns/UpdateMatchPlayersOperation';
import PostInvitationEmailOperation from 'src/core/campaigns/operations/PostInvitationEmailOperation';
import UpdateCampaignImagesOperation from 'src/core/campaigns/operations/UpdateCampaignImagesOperation';
import PostBanPlayerOperation from 'src/core/campaigns/operations/PostBanPlayerOperation';

export interface CampaignsControllerContract {
    getAllCampaignsOperation: GetAllCampaignsOperation;
    getCampaignByIdOperation: GetCampaignByIdOperation;
    publishmentOperation: PublishmentOperation;
    createCampaignOperation: createCampaignOperation;
    updateCampaignOperation: UpdateCampaignOperation;
    updateMatchMapImagesOperation: UpdateMatchMapImagesOperation;
    updateMatchMusicsOperation: UpdateMatchMusicsOperation;
    updateMatchDatesOperation: UpdateMatchDatesOperation;
    updateMatchPlayersOperation: UpdateMatchPlayersOperation;
    postInvitationEmailOperation: PostInvitationEmailOperation;
    postBanPlayerOperation: PostBanPlayerOperation;
    updateCampaignImagesOperation: UpdateCampaignImagesOperation;
}
