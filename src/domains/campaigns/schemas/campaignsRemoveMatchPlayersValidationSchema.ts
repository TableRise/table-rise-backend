import { z } from 'zod';

const campaignsRemoveMatchPlayersZodSchema = z.object({
    campaignId: z.string(),
    characterId: z.string().optional(),
    userId: z.string(),
});

export type CampaignRemovePayload = z.infer<typeof campaignsRemoveMatchPlayersZodSchema>;
export default campaignsRemoveMatchPlayersZodSchema;
