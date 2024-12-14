import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';
import campaignsUpdateMatchDatesZod from './campaignsUpdateMatchDatesValidationSchema';
import campaignPost from './campaignsPostValidationSchema';
import campaignInvitationEmailZod from './campaignsInvitationEmailValidation';
import campaignBanPlayerZod from './campaignsBanPlayerValidation';
import campaignsUpdateMatchPlayersZod from './campaignsUpdateMatchPlayersValidationSchema';

const schemas = {
    campaignZod,
    campaignUpdateZod,
    campaignsUpdateMatchDatesZod,
    campaignPost,
    campaignInvitationEmailZod,
    campaignBanPlayerZod,
    campaignsUpdateMatchPlayersZod,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
