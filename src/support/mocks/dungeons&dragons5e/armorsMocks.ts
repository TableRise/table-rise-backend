import { DnDArmor } from '@tablerise/database-management';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const armorMockEn: DnDArmor = {
    type: 'Light Armor',
    name: 'Padded',
    description: 'A simple padded',
    cost: {
        currency: 'gp',
        value: 5,
    },
    weight: 8,
    armorClass: 11,
    requiredStrength: 0,
    stealthPenalty: true,
};

const armorMockPt: DnDArmor = {
    type: 'Armadura Leve',
    name: 'Acolchoada',
    description: 'Uma simples armadura acolchoada',
    cost: {
        currency: 'gp',
        value: 5,
    },
    weight: 8,
    armorClass: 11,
    requiredStrength: 0,
    stealthPenalty: true,
};

const armor: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: armorMockEn,
        pt: armorMockPt,
    },
    description: 'Mock an instance of a RPG armor',
};

export default armor;
