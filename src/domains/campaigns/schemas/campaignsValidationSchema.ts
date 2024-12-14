import { imageObjectZodSchema } from 'src/domains/common/schemas/commonValidationSchema';
import { z } from 'zod';
import campaignVisibilityEnum from '../enums/campaignVisibilityEnum';
import systemsEnum from 'src/domains/common/enums/systemsEnum';
import {
    ImageCampaign,
    Infos,
    Lores,
    MatchData,
    Player,
} from '@tablerise/database-management/dist/src/interfaces/Campaigns';

const campaignsZodSchema = z.object({
    title: z.string(),
    cover: imageObjectZodSchema.or(z.string()).optional(),
    description: z.string().max(255),
    visibility: z.enum(campaignVisibilityEnum.values).optional(),
    system: z.enum(systemsEnum.values),
    ageRestriction: z.string().or(z.number()),
});

export type CampaignPayload = z.infer<typeof campaignsZodSchema>;
export type CampaignInstance = z.infer<typeof campaignsZodSchema> & {
    campaignId: string;
    campaignPlayers: Player[];
    bannedPlayers: string[];
    matchData?: MatchData;
    infos: Infos;
    lores: Lores;
    images: ImageCampaign;
    createdAt: string;
    updatedAt: string;
};

export default campaignsZodSchema;
