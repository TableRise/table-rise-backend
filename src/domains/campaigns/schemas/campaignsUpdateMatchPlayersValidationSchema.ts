import { z } from 'zod';

const campaignsUpdateMatchPlayersZodSchema = z.object({
    campaignId: z.string(),
    characterId: z.string().optional(),
    userId: z.string(),
    operation: z.enum(['add', 'remove']),
});

export type CampaignUpdatePayload = z.infer<typeof campaignsUpdateMatchPlayersZodSchema>;
export default campaignsUpdateMatchPlayersZodSchema;
