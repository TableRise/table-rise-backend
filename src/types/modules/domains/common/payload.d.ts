import { InProgressStatusEnum } from 'src/domains/users/enums/InProgressStatusEnum';

export interface StateMachineResponse {
    status: InProgressStatusEnum;
    prevStatusMustBe: InProgressStatusEnum;
    nextStatusWillBe: InProgressStatusEnum;
}
