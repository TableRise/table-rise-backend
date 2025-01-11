import { z } from 'zod';
import { updateUserDetails } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import stateFlowsEnum, { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import { InProgressStatus } from '../enums/InProgressStatusEnum';

const twoFactorSecretZodSchema = z.object({
    secret: z.string().optional(),
    qrcode: z.string().optional(),
    active: z.boolean(),
});

const usersZodSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
        message: 'Invalid password',
    }),
    nickname: z.string().max(32),
});

export const verifyEmailZodSchema = z.object({
    email: z.string().email(),
    flow: z.enum(stateFlowsEnum.values),
});

export const emailUpdateZodSchema = z.object({
    email: z.string().email(),
});

export const passwordUpdateZodSchema = z.object({
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
        message: 'Invalid password',
    }),
});

export const updateUserZodSchema = z.object({
    nickname: z.string().max(32).optional(),
    details: updateUserDetails.optional(),
});

export const userLoginZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32),
});

export type UserPayload = z.infer<typeof usersZodSchema>;
export type UserInstance = z.infer<typeof usersZodSchema> & {
    userId: string;
    providerId: string;
    inProgress: {
        status: InProgressStatus;
        currentFlow: stateFlowsKeys;
        prevStatusMustBe: InProgressStatus;
        nextStatusWillBe: InProgressStatus;
        code: string;
    };
    twoFactorSecret: {
        qrcode?: string;
        secret?: string;
        active: boolean;
    };
    picture: ImageObject | null;
    tag: string;
    createdAt: string;
    updatedAt: string;
};

export type UserLogin = z.infer<typeof userLoginZodSchema>;
export type UserTwoFactor = z.infer<typeof twoFactorSecretZodSchema>;
export type UserVerifyEmail = z.infer<typeof verifyEmailZodSchema>;

export default usersZodSchema;
