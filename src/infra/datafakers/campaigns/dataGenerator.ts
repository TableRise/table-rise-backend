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
    matchData: {
        matchId: faker.string.uuid(),
        avatars: [],
        avatarsInGame: [],
        musics: [],
        mapImages: [],
        password: '123',
        actualMapImage: {
            id: '',
            title: '',
            link: '',
            uploadDate: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        },
        logs: [],
        password: '1234',
    },
    infos: {
        campaignAge: '1',
        matchDates: [],
        announcements: [],
        visibility: faker.helpers.arrayElement(['hidden', 'visible']),
    },
    password: '1234',
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
