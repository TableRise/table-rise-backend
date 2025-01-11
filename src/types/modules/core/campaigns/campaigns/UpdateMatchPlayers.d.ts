import UpdateMatchPlayersService from 'src/core/campaigns/services/campaigns/UpdateMatchPlayersService';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchPlayersOperationContract {
    updateMatchPlayersService: UpdateMatchPlayersService;
    schemaValidator: SchemaValidator;
    campaignsSchema: SchemasCampaignType;
    logger: Logger;
}

export interface UpdateMatchPlayersServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
