import PostBanPlayerService from 'src/core/campaigns/services/PostBanPlayerService';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface postInvitationEmailOperationContract {
    campaignsSchema: SchemasCampaignType;
    schemaValidator: SchemaValidator;
    postBanPlayerService: PostBanPlayerService;
    logger: Logger;
}

export interface PostBanPlayerServiceContract {
    httpRequestErrors: HttpRequestErrors;
    usersDetailsRepository: UsersDetailsRepository;
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
