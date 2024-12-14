import { z } from 'zod';

const campaignBanPlayerZodSchema = z.object({
    playerId: z.string().uuid(),
    campaignId: z.string().uuid(),
});

export type campaignBanPlayerPayload = z.infer<typeof campaignBanPlayerZodSchema>;
export default campaignBanPlayerZodSchema;
