import { z } from 'zod';

const campaignsAddMatchPlayersZodSchema = z.object({
    campaignId: z.string(),
    characterId: z.string(),
    userId: z.string(),
    password: z.string().regex(/^\d{4}$/, {
        message: 'Invalid password',
    }),
});

export type CampaignAddPayload = z.infer<typeof campaignsAddMatchPlayersZodSchema>;
export default campaignsAddMatchPlayersZodSchema;
