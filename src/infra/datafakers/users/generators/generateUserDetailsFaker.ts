import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserDetailJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import dataGenerator from '../dataGenerator';
import questionEnum from 'src/domains/users/enums/questionEnum';

function createUserDetailFaker({
    userDetailId = newUUID(),
}: UserDetailInstance): UserDetailInstance {
    return {
        userDetailId,
        userId: newUUID(),
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        pronoun: 'she/her',
        secretQuestion: {
            question: questionEnum.enum.WHAT_COLOR_DO_YOU_LIKE_THE_MOST,
            answer: 'black',
        },
        birthday: dataGenerator.birthday().toISOString(),
        gameInfo: { campaigns: [], characters: [], badges: [], bannedFromCampaigns: [] },
        biography: dataGenerator.biography(),
        role: 'admin',
    } as UserDetailInstance;
}

export default function generateUserDetailsFaker({
    count,
    userDetailId,
}: UserDetailJSONPayload): UserDetailInstance[] {
    const users: UserDetailInstance[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserDetailFaker({ userDetailId } as UserDetailInstance));
    }

    return users;
}
