import { Wiki } from './../../schemas/wikisValidationSchema';
import generateNewMongoID from '../helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const wikiMockEn: Wiki = {
    title: 'Wiki title',
    description: 'Wiki description',
    reference: 'Book of rules',
    image: 'https://img.db.com',
    subTopics: [
        {
            subTitle: 'My subtitle',
            description: 'subTopic description',
        },
    ],
};

const wikiMockPt: Wiki = {
    title: 'Título da wiki',
    description: 'Descrição da wiki',
    reference: 'Livro de regras',
    image: 'https://img.db.com',
    subTopics: [
        {
            subTitle: 'Meu subtitulo',
            description: 'descrição do subTópico',
        },
    ],
};

const wiki: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: wikiMockEn,
        pt: wikiMockPt,
    },
    description: 'Mock an instance of a RPG wiki',
};

export default wiki;
