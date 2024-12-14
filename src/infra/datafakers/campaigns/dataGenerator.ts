import { faker } from '@faker-js/faker';

export default {
    title: faker.company.catchPhrase(),
    description: faker.company.buzzPhrase(),
    visibility: faker.helpers.arrayElement(['hidden', 'visible']),
    system: faker.helpers.arrayElement(['dnd5e']),
    ageRestriction: faker.number.int({ min: 1, max: 18 }),
    cover: {
        id: faker.string.uuid(),
        title: faker.word.sample(),
        link: faker.internet.url(),
        uploadDate: faker.date.anytime().toISOString(),
        thumbSizeUrl: faker.internet.url(),
        mediumSizeUrl: faker.internet.url(),
        deleteUrl: faker.internet.url(),
        request: { success: true, status: 200 },
    },
    campaignPlayers: [
        {
            userId: faker.string.uuid(),
            characterIds: [],
            role: faker.helpers.arrayElement([
                'admin_player',
                'dungeon_master',
                'player',
            ]),
            status: faker.helpers.arrayElement(['pending']),
        },
    ],
    bannedPlayers: [faker.string.uuid()],
    matchData: {
        matchId: faker.string.uuid(),
        avatars: [],
        avatarsInGame: [],
        musics: [],
        mapImages: [],
        actualMapImage: {
            id: '',
            title: '',
            link: '',
            uploadDate: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        },
        password: faker.word.sample(),
        logs: [],
    },
    infos: {
        campaignAge: '1',
        matchDates: [],
        announcements: [],
        visibility: faker.helpers.arrayElement(['hidden', 'visible']),
    },
    lores: {
        playerCharacters: [],
        dungeonMasterCharacters: [],
        environments: [],
        mainHistory: [],
    },
    images: {
        characters: [],
        maps: [],
    },
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
};
