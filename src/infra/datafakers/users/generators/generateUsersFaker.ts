import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import dataGenerator from '../dataGenerator';
import DomainDataFaker from '../../campaigns/DomainDataFaker';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

function createUserFaker({ userId = newUUID() }: UserInstance): UserInstance {
    return {
        userId,
        inProgress: {
            status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
            currentFlow: stateFlowsEnum.enum.CREATE_USER,
            prevStatusMustBe: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: 'HJS74',
        },
        providerId: '',
        email: dataGenerator.email(),
        password: 'TheWorld@122',
        nickname: dataGenerator.nickname(),
        tag: `#${dataGenerator.number({ min: 1000, max: 9999 })}`,
        picture: DomainDataFaker.generateImagesObjectJSON()[0],
        twoFactorSecret: { active: false },
    } as UserInstance;
}

export default function generateUsersFaker({
    count,
    userId,
}: UserJSONPayload): UserInstance[] {
    const users: UserInstance[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserFaker({ userId } as UserInstance));
    }

    return users;
}
