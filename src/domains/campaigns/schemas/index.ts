import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';
import campaignsUpdateMatchDatesZod from './campaignsUpdateMatchDatesValidationSchema';
import campaignPost from './campaignsPostValidationSchema';
import campaignInvitationEmailZod from './campaignsInvitationEmailValidation';
import campaignsAddMatchPlayersZod from './campaignsAddMatchPlayersValidationSchema';
import campaignsRemoveMatchPlayersZod from './campaignsRemoveMatchPlayersValidationSchema';

const schemas = {
    campaignZod,
    campaignUpdateZod,
    campaignsUpdateMatchDatesZod,
    campaignPost,
    campaignInvitationEmailZod,
    campaignsAddMatchPlayersZod,
    campaignsRemoveMatchPlayersZod,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
