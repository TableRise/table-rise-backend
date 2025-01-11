import AddMatchPlayersService from 'src/core/campaigns/services/campaigns/AddMatchPlayersService';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import { Logger } from 'src/types/shared/logger';

export interface AddMatchPlayersOperationContract {
    addMatchPlayersService: AddMatchPlayersService;
    schemaValidator: SchemaValidator;
    campaignsSchema: SchemasCampaignType;
    logger: Logger;
}

export interface AddMatchPlayersServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
