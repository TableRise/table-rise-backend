import { z } from 'zod';

const campaignInvitationEmailZodSchema = z.object({
    targetEmail: z.string().email(),
    userId: z.string(),
    campaignId: z.string().uuid(),
    username: z.string(),
});

export type campaignInvitationEmailPayload = z.infer<
    typeof campaignInvitationEmailZodSchema
>;
export default campaignInvitationEmailZodSchema;
