import userStatusEnum, {
    InProgressStatus,
} from 'src/domains/users/enums/InProgressStatusEnum';
import HttpRequestErrors from './helpers/HttpRequestErrors';
import getErrorName from './helpers/getErrorName';
import { HttpStatusCode } from './helpers/HttpStatusCode';
import stateFlowsEnum, { stateFlowsKeys } from './enums/stateFlowsEnum';
import { UserInstance } from '../users/schemas/usersValidationSchema';
import DomainsDependencies from 'src/types/modules/domains/DomainsDependencies';
import { StateMachineProps } from 'src/types/modules/domains/StateMachine';

const status = userStatusEnum.enum;
const flows = stateFlowsEnum.enum;

export const StateMachineFlow = {
    [flows.UPDATE_PASSWORD]: [
        status.DONE,
        status.WAIT_TO_START_PASSWORD_CHANGE,
        status.WAIT_TO_SECOND_AUTH,
        status.WAIT_TO_FINISH_PASSWORD_CHANGE,
        status.DONE,
    ],
    [flows.CREATE_USER]: [status.WAIT_TO_CONFIRM, status.DONE],
    [flows.ACTIVATE_SECRET_QUESTION]: [
        status.DONE,
        status.WAIT_TO_ACTIVATE_SECRET_QUESTION,
        status.DONE,
    ],
    [flows.UPDATE_SECRET_QUESTION]: [
        status.DONE,
        status.WAIT_TO_UPDATE_SECRET_QUESTION,
        status.DONE,
    ],
    [flows.ACTIVATE_TWO_FACTOR]: [
        status.DONE,
        status.WAIT_TO_ACTIVATE_TWO_FACTOR,
        status.DONE,
    ],
    [flows.RESET_TWO_FACTOR]: [
        status.DONE,
        status.WAIT_TO_START_RESET_TWO_FACTOR,
        status.WAIT_TO_FINISH_RESET_TWO_FACTOR,
        status.DONE,
    ],
    [flows.UPDATE_EMAIL]: [
        status.DONE,
        status.WAIT_TO_START_EMAIL_CHANGE,
        status.WAIT_TO_SECOND_AUTH,
        status.WAIT_TO_FINISH_EMAIL_CHANGE,
        status.DONE,
    ],
    [flows.RESET_PROFILE]: [status.DONE, status.WAIT_TO_RESET_PROFILE, status.DONE],
    [flows.DELETE_PROFILE]: [
        status.DONE,
        status.WAIT_TO_FINISH_DELETE_USER,
        status.WAIT_TO_DELETE_USER,
    ],
};

export default class StateMachine {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        logger,
    }: DomainsDependencies['stateMachineContract']) {
        this._usersRepository = usersRepository;
        this._logger = logger;
    }

    public get props(): StateMachineProps {
        return {
            flows: stateFlowsEnum.enum,
            status: userStatusEnum.enum,
        };
    }

    private _checkPrevStatus(
        prevStatusMustBe: InProgressStatus,
        flow: InProgressStatus[],
        status: InProgressStatus,
        stepIndex: number,
        user: UserInstance
    ): void {
        const prevStatusFromActual = flow[stepIndex === 0 ? stepIndex : stepIndex - 1];

        if (
            prevStatusFromActual !== prevStatusMustBe &&
            user.inProgress.currentFlow !== flows.NO_CURRENT_FLOW
        ) {
            const errorMessageOne = `Entity actual status is ${status}`;
            const errorMessageTwo = `and previous status should be ${prevStatusMustBe}`;
            const errorMessageThree = `but is actually ${prevStatusFromActual}`;
            const message = `${errorMessageOne} ${errorMessageTwo} ${errorMessageThree}`;

            throw new HttpRequestErrors({
                message,
                name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                code: HttpStatusCode.UNPROCESSABLE_ENTITY,
            });
        }
    }

    private _checkNextStatus(
        nextStatusMustBe: InProgressStatus,
        flow: InProgressStatus[],
        status: InProgressStatus,
        stepIndex: number,
        user: UserInstance
    ): void {
        const nextStatusFromActual =
            flow[stepIndex + 1 === flow.length ? stepIndex : stepIndex + 1];

        if (
            nextStatusFromActual !== nextStatusMustBe &&
            nextStatusMustBe !== 'wait-for-new-flow'
        ) {
            const errorMessageOne = `Entity actual status is ${status}`;
            const errorMessageTwo = `and next status should be ${nextStatusMustBe}`;
            const errorMessageThree = `but is actually ${nextStatusFromActual}`;
            const message = `${errorMessageOne} ${errorMessageTwo} ${errorMessageThree}`;

            throw new HttpRequestErrors({
                message,
                name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                code: HttpStatusCode.UNPROCESSABLE_ENTITY,
            });
        }
    }

    private _moveStatus(
        user: UserInstance,
        stepIndex: number,
        selectFlow: InProgressStatus[],
        flow: stateFlowsKeys
    ): UserInstance['inProgress'] {
        const userActualStatus =
            selectFlow.length > stepIndex + 1 ? selectFlow[stepIndex + 1] : selectFlow[0];

        let userCurrentFlow =
            stepIndex + 1 === selectFlow.length - 1
                ? flows.NO_CURRENT_FLOW
                : user.inProgress.currentFlow;

        if (
            userCurrentFlow === flows.NO_CURRENT_FLOW &&
            stepIndex === 0 &&
            selectFlow.length > 2
        ) {
            userCurrentFlow = flow;
        }

        const userPrevStatus = selectFlow[stepIndex];

        const userNextStatus =
            stepIndex < selectFlow.length - 2
                ? selectFlow[stepIndex + 2]
                : ('wait-for-new-flow' as InProgressStatus);

        return {
            status: userActualStatus,
            currentFlow: userCurrentFlow,
            prevStatusMustBe: userPrevStatus,
            nextStatusWillBe: userNextStatus,
            code: user.inProgress.code,
        };
    }

    public async machine(
        flow: stateFlowsKeys,
        user: UserInstance
    ): Promise<UserInstance> {
        this._logger('warn', 'Machine - StateMachine');

        const { status, nextStatusWillBe, prevStatusMustBe } = user.inProgress;

        this._logger(
            'info',
            `Actual user status is ${status} and must change to ${nextStatusWillBe}`
        );

        const selectFlow = StateMachineFlow[flow as keyof typeof StateMachineFlow];
        const stepIndex = selectFlow.findIndex((flowState) => flowState === status);

        this._checkPrevStatus(prevStatusMustBe, selectFlow, status, stepIndex, user);
        this._checkNextStatus(nextStatusWillBe, selectFlow, status, stepIndex, user);

        user.inProgress = this._moveStatus(user, stepIndex, selectFlow, flow);

        const userWithStatesUpdated = await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        this._logger('info', 'Status update successfully completed');

        return userWithStatesUpdated;
    }
}
