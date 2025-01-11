import newUUID from 'src/domains/common/helpers/newUUID';
import {
    AbilityScoreIncrease,
    Armor,
    Background,
    Class,
    Feat,
    God,
    Item,
    MagicItem,
    Monster,
    Race,
    Realm,
    Spell,
    Weapon,
    Wiki,
} from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';

function createArmorsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Armor> & { armorId: string } {
    return {
        armorId: entityId || newUUID(),
        active: true,
        en: {
            type: 'Plate',
            name: 'Steel Plate',
            description: 'A sturdy steel plate armor for maximum protection.',
            cost: {
                value: 200,
                currency: 'gold',
            },
            weight: 30,
            armorClass: 18,
            requiredStrength: 15,
            stealthPenalty: true,
        },
        pt: {
            type: 'Placa',
            name: 'Placa de Aço',
            description: 'Uma armadura de placa de aço resistente para máxima proteção.',
            cost: {
                value: 200,
                currency: 'ouro',
            },
            weight: 30,
            armorClass: 18,
            requiredStrength: 15,
            stealthPenalty: true,
        },
    };
}

function createFeatsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Feat> & { featId: string } {
    return {
        featId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Grappler',
            prerequisite: 'Strength 13 or higher',
            description:
                "You've developed the skills necessary to hold your own in close-quarters grappling.",
            benefits: [
                'You have advantage on attack rolls against a creature you are grappling.',
                'You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.',
            ],
        },
        pt: {
            name: 'Grappler',
            prerequisite: 'Força 13 ou superior',
            description:
                'Você desenvolveu as habilidades necessárias para se manter em confrontos de agarrar em espaços confinados.',
            benefits: [
                'Você tem vantagem em rolagens de ataque contra uma criatura que você está agarrando.',
                'Você pode usar sua ação para tentar imobilizar uma criatura que esteja agarrada por você. Para fazer isso, faça outra rolagem de agarrar. Se tiver sucesso, você e a criatura ficam restritos até o fim do agarrão.',
            ],
        },
    };
}

function createBackgroundsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Background> & { backgroundId: string } {
    return {
        backgroundId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Acolyte',
            description:
                "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshippers into the presence of the divine. You are not necessarily a cleric—performing sacred rites is not the same thing as channeling divine power.\nChoose a god, a pantheon of gods, or some other quasi-divine being from among those listed in 'Fantasy-Historical Pantheons' or those specified by your GM, and work with your GM to detail the nature of your religious service. Were you a lesser functionary in a temple, raised from childhood to assist the priests in the sacred rites? Or were you a high priest who suddenly experienced a call to serve your god in a different way? Perhaps you were the leader of a small cult outside of any established temple structure, or even an occult group that served a fiendish master that you now deny.",
            skillProficiencies: ['Insight', 'Religion'],
            languages: ['common'],
            equipment: [
                'Holy symbol (a gift to you when you entered the priesthood)',
                'A prayer book or prayer wheel',
                '5 sticks of incense',
                'vestments',
                'A set of common clothes',
                'a pouch containing 15 gp',
            ],
            characteristics: {
                name: 'Shelter of the Faithful',
                description:
                    'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.\nYou might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple.',
                suggested: {
                    personalityTrait: [
                        "I idolize a particular hero of my faith and constantly refer to that person's deeds and example.",
                        'I can find common ground between the fiercest enemies, empathizing with them and always working toward peace.',
                        'I see omens in every event and action. The gods try to speak to us, we just need to listen.',
                        'Nothing can shake my optimistic attitude.',
                        'I quote (or misquote) sacred texts and proverbs in almost every situation.',
                        'I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods.',
                        "I've enjoyed fine food, drink, and high society among my temple’s elite. Rough living grates on me.",
                        "I've spent so long in the temple that I have little practical experience dealing with people in the outside world.",
                    ],
                    ideal: [
                        'Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)',
                        'Charity. I always try to help those in need, no matter what the personal cost. (Good)',
                        'Change. We must help bring about the changes the gods are constantly working in the world. (Chaotic)',
                        "Power. I hope to one day rise to the top of my faith's religious hierarchy. (Lawful)",
                        'Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well. (Lawful)',
                        "Aspiration. I seek to prove myself worthy of my god's favor by matching my actions to my deity's teachings. (Any)",
                    ],
                    bond: [
                        'I would die to recover an ancient relic of my faith that was lost long ago.',
                        'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.',
                        'I owe my life to the priest who took me in when my parents died.',
                        'Everything I do is for the common people.',
                        'I will do anything to protect the temple where I served.',
                        'I seek to preserve a sacred text that my enemies seek to destroy.',
                    ],
                    flaw: [
                        'Judge others harshly, and myself even more severely.',
                        "I put too much trust in those who wield power within my temple's hierarchy.",
                        'My piety sometimes leads me to blindly trust those that profess faith in my god.',
                        'I am inflexible in my thinking.',
                        'I am suspicious of strangers and expect the worst of them.',
                        'Once I pick a goal, I become obsessed with it to the detriment of everything else in my life.',
                    ],
                },
            },
        },
        pt: {
            name: 'Acólito',
            description:
                "Você passou sua vida no serviço de um templo dedicado a um deus específico ou panteão de deuses. Você age como intermediário entre o reino sagrado e o mundo mortal, realizando rituais sagrados e oferecendo sacrifícios para conduzir adoradores à presença do divino. Você não é necessariamente um clérigo - realizar rituais sagrados não é a mesma coisa que canalizar poder divino.\nEscolha um deus, um panteão de deuses ou algum outro ser quase-divino entre aqueles listados em 'Fantasy-Historical Pantheons' ou especificados pelo seu GM, e trabalhe com seu GM para detalhar a natureza do seu serviço religioso. Você era um funcionário de menor importância em um templo, criado desde a infância para auxiliar os sacerdotes nos rituais sagrados? Ou era um sumo sacerdote que de repente recebeu um chamado para servir seu deus de uma maneira diferente? Talvez você fosse o líder de um pequeno culto fora de qualquer estrutura de templo estabelecida, ou até mesmo um grupo ocultista que servia a um mestre demoníaco que agora você nega.",
            skillProficiencies: ['Percepção', 'Religião'],
            languages: ['comum'],
            equipment: [
                'Símbolo sagrado (um presente para você quando ingressou no sacerdócio)',
                'Um livro de orações ou roda de orações',
                '5 bastões de incenso',
                'Vestes',
                'Um conjunto de roupas comuns',
                'Uma bolsa contendo 15 po.',
            ],
            characteristics: {
                name: 'Amparo dos Fiéis',
                description:
                    'Como acólito, você recebe o respeito daqueles que compartilham sua fé e pode realizar as cerimônias religiosas de sua divindade. Você e seus companheiros de aventura podem esperar receber cura e cuidados gratuitos em um templo, santuário ou outra presença estabelecida de sua fé, embora você deva fornecer quaisquer componentes materiais necessários para as magias. Aqueles que compartilham sua religião o apoiarão (apenas você) em um estilo de vida modesto.\nVocê também pode ter laços com um templo específico dedicado à sua divindade ou panteão escolhido, e ter uma residência lá. Isso pode ser o templo onde você costumava servir, se você mantiver bons termos com ele, ou um templo onde você encontrou um novo lar. Quando estiver perto do seu templo, você pode pedir ajuda aos sacerdotes, desde que a ajuda solicitada não seja perigosa e você mantenha uma boa relação com seu templo.',
                suggested: {
                    personalityTrait: [
                        'Idolatro um herói específico da minha fé e constantemente faço referência aos feitos e exemplo dessa pessoa.',
                        'Consigo encontrar pontos em comum entre os inimigos mais ferozes, empatizando com eles e sempre trabalhando pela paz.',
                        'Vejo presságios em cada evento e ação. Os deuses tentam falar conosco, só precisamos ouvir.',
                        'Nada abala minha atitude otimista.',
                        'Cito (ou deturpo) textos sagrados e provérbios em quase todas as situações.',
                        'Sou tolerante (ou intolerante) em relação a outras fé e respeito (ou condeno) a adoração de outros deuses.',
                        'Desfrutei de boa comida, bebida e alta sociedade entre a elite do meu templo. Viver de forma simples me incomoda.',
                        'Passei tanto tempo no templo que tenho pouca experiência prática em lidar com pessoas no mundo exterior.',
                    ],
                    ideal: [
                        'Tradição. As antigas tradições de adoração e sacrifício devem ser preservadas e mantidas. (Leal)',
                        'Caridade. Sempre tento ajudar aqueles em necessidade, não importando o custo pessoal. (Bom)',
                        'Mudança. Devemos ajudar a promover as mudanças que os deuses estão constantemente realizando no mundo. (Caótico)',
                        'Poder. Espero um dia chegar ao topo da hierarquia religiosa da minha fé. (Leal)',
                        'Fé. Confio que minha divindade guiará minhas ações. Tenho fé de que, se trabalhar duro, as coisas correrão bem. (Leal)',
                        'Aspiração. Busco me provar digno do favor do meu deus, vivendo de acordo com os ensinamentos dele. (Qualquer)',
                    ],
                    bond: [
                        'Daria minha vida para recuperar um relicário antigo da minha fé que foi perdido há muito tempo.',
                        'Um dia me vingarei da hierarquia corrupta do templo que me rotulou como herege.',
                        'Devo minha vida ao sacerdote que me acolheu quando meus pais morreram.',
                        'Tudo o que faço é para o povo comum.',
                        'Farei qualquer coisa para proteger o templo onde servi.',
                        'Busco preservar um texto sagrado que meus inimigos buscam destruir.',
                    ],
                    flaw: [
                        'Julgar os outros severamente e a mim mesmo ainda mais.',
                        'Colocar confiança demais naqueles que detêm poder dentro da hierarquia do meu templo.',
                        'Minha piedade às vezes me leva a confiar cegamente naqueles que professam fé no meu deus.',
                        'Ser inflexível em meu pensamento.',
                        'Ser desconfiado de estranhos e esperar o pior deles.',
                        'Uma vez que defino um objetivo, me torno obcecado por ele em detrimento de tudo o mais em minha vida.',
                    ],
                },
            },
        },
    };
}

function createClassesFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Class> & { classId: string } {
    return {
        classId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Barbarian',
            description:
                'You dedicate your life to the art of war, and your greatest pleasure is knowing that with each battle, your power and strength grow stronger. As an ally, you are an indispensable resource in any army and a source of fear for any enemy. As a friend, you protect your own even if it means sacrificing your own life, for it would be a dishonor for you, barbarian, to fail in protecting those you love.\n\nYour fury is relentless, and your resilience is formidable. Stories are told far and wide of how mighty barbarians have been able to defeat armies single-handedly, and with you, it will be no different.',
            hitPoints: {
                hitDice: '1d12 per barbarian level',
                hitPointsAtFirstLevel: '12 + Constitution modifier',
                hitPointsAtHigherLevels:
                    '1d12 (or 7) + Constitution modifier per barbarian level after first level',
            },
            proficiencies: {
                armor: ['light armor', 'medium armor', 'shields'],
                weapons: ['simple weapons', 'martial weapons'],
                tools: [],
                savingThrows: ['strength', 'constitution'],
                skills: [
                    'animal handling',
                    'athletics',
                    'intimidation',
                    'nature',
                    'perception',
                    'survival',
                ],
            },
            equipment: [
                {
                    a: 'greataxe',
                    b: 'martial melee weapon',
                },
                {
                    a: 'two handaxes',
                    b: 'simple weapon',
                },
                {
                    a: "explorer's pack and four javelins",
                    b: 'no-alternative',
                },
            ],
            levelingSpecs: {
                level: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                ],
                proficiencyBonus: [
                    2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
                ],
                features: [
                    'Range, Unarmored Defense',
                    'Reckless Attack, Danger Sense',
                    'Primal Path',
                    'Ability Score Improvement',
                    'Extra Attack',
                    'Fast Movement',
                    'Path Feature',
                    'Feral Instinct',
                    'Ability Score Improvement',
                    'Brutal Critical (1 dice)',
                    'Path Feature',
                    'Relentless Rage',
                    'Ability Score Improvement',
                    'Brutal Critical (2 dice)',
                    'Path Feature',
                    'Persistent Rage',
                    'Ability Score Improvement',
                    'Brutal Critical (3 dice)',
                    'Indomitable Might',
                    'Ability Score Improvement',
                    'Primal Champion',
                ],
                cantripsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                spellSlotsPerSpellLevel: {
                    isValidToThisClass: false,
                    spellLevel: [],
                    spellSpaces: [],
                },
                spellsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                kiPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                martialArts: {
                    isValidToThisClass: false,
                    amount: [],
                },
                unarmoredMovement: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sneakAttack: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sorceryPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                invocationsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                rages: {
                    isValidToThisClass: true,
                    amount: [
                        2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 999,
                    ],
                },
                rageDamage: {
                    isValidToThisClass: true,
                    amount: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
                },
            },
            characteristics: [
                {
                    title: 'Rage',
                    description:
                        "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.\n\nWhile raging, you gain the following benefits if you aren't wearing heavy armor:\n\nYou have advantage on Strength checks and Strength saving throws.\n\nWhen you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table.\n\nYou have resistance to bludgeoning, piercing, and slashing damage.\n\nIf you are able to cast spells, you can't cast them or concentrate on them while raging.\n\nYour rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.\n\nOnce you have raged the number of times shown for your barbarian level in the Rages column of the Barbarian table, you must finish a long rest before you can rage again.",
                },
                {
                    title: 'Unarmored Defense',
                    description:
                        'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.',
                },
                {
                    title: 'Reckless Attack',
                    description:
                        'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.',
                },
                {
                    title: 'Danger Sense',
                    description:
                        "At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger.\n\nYou have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.",
                },
                {
                    title: 'Primal Path',
                    description:
                        'At 3rd level, you choose a path that shapes the nature of your rage. Choose the Path of the Berserker or the Path of the Totem Warrior, both detailed at the end of the class description. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels.',
                },
                {
                    title: 'Ability Score Improvement',
                    description:
                        "When you reach 4th level, and again at 8th, 12th, 16th and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                },
                {
                    title: 'Extra Attack',
                    description:
                        'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
                },
                {
                    title: 'Fast Movement',
                    description:
                        "Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor.",
                },
                {
                    title: 'Feral Instinct',
                    description:
                        "By 7th level, your instincts are so honed that you have advantage on initiative rolls.\n\nAdditionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.",
                },
                {
                    title: 'Brutal Critical',
                    description:
                        'Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.\n\nThis increases to two additional dice at 13th level and three additional dice at 17th level.',
                },
                {
                    title: 'Relentless Rage',
                    description:
                        "Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.\n\nEach time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.",
                },
                {
                    title: 'Persistent Rage',
                    description:
                        'Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.',
                },
                {
                    title: 'Indomitable Might',
                    description:
                        'Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.',
                },
                {
                    title: 'Primal Champion',
                    description:
                        'At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.',
                },
                {
                    title: 'Path of the Berserker',
                    description:
                        "For some barbarians, rage is a means to an end–that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood. As you enter the berserker's rage, you thrill in the chaos of battle, heedless of your own health or well-being.",
                },
                {
                    title: 'Frenzy',
                    description:
                        "Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.",
                },
                {
                    title: 'Mindless Rage',
                    description:
                        "Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.",
                },
                {
                    title: 'Intimidating Presence',
                    description:
                        "Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.\n\nIf the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.",
                },
                {
                    title: 'Retaliation',
                    description:
                        'Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.',
                },
            ],
            subClass: [
                {
                    title: 'Trail of the Beast',
                    description: 'Transform into a beast with deadly unarmed attacks.',
                    characteristics: [
                        {
                            title: 'Shape of the Beast',
                            description:
                                'You can transform, revealing the bestial power within you. Choose bite, claw or tail as your attack method',
                        },
                    ],
                },
            ],
        },
        pt: {
            name: 'Bárbaro',
            description:
                'Você dedica sua vida a arte da guerra e o seu maior prazer é saber que a cada batalha seu poder e força crescem cada vez mais, como um aliado você é um recurso indíspensavel em qualquer exercito e uma fonte de medo para qualquer inimigo, como amigo você protege os seus mesmo que precise entregar sua própria vida, afinal seria uma desonra para você bárbaro não conseguir proteger aqueles que ama.\n\nSua fúria é implacável e sua resistência formidável, histórias são contadas pelos quatro cantos do mundo de como barbáros poderosos foram capazes de vencer exercitos sozinhos, e com você não será diferente.',
            hitPoints: {
                hitDice: '1d12 por nível de bárbaro',
                hitPointsAtFirstLevel: '12 + modificador de Constituição',
                hitPointsAtHigherLevels:
                    '1d12 (ou 7) + modificador de Constituição por nível de bárbaro após o primeiro nível',
            },
            proficiencies: {
                armor: ['armadura leve', 'armadura média', 'escudos'],
                weapons: ['armas simples', 'armas marciais'],
                tools: [],
                savingThrows: ['força', 'constituição'],
                skills: [
                    'adestrar animais',
                    'atletismo',
                    'intimidação',
                    'natureza',
                    'percepção',
                    'sobrevivência',
                ],
            },
            equipment: [
                {
                    a: 'grande machado',
                    b: 'arma marcial corpo a corpo',
                },
                {
                    a: 'dois machados de mão',
                    b: 'arma simples',
                },
                {
                    a: 'mochila do aventureiro e quatro dardos',
                    b: 'no-alternative',
                },
            ],
            levelingSpecs: {
                level: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                ],
                proficiencyBonus: [
                    2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
                ],
                features: [
                    'Raiva, Defesa Inarmada',
                    'Ataque Despreocupado, Sentido de Perigo',
                    'Caminho Primitivo',
                    'Melhoria de Atributo',
                    'Ataque Extra',
                    'Movimento Rápido',
                    'Característica do Caminho',
                    'Instinto Selvagem',
                    'Melhoria de Atributo',
                    'Crítico Brutal (1 dado)',
                    'Característica do Caminho',
                    'Raiva Implacável',
                    'Melhoria de Atributo',
                    'Crítico Brutal (2 dados)',
                    'Característica do Caminho',
                    'Raiva Persistente',
                    'Melhoria de Atributo',
                    'Crítico Brutal (3 dados)',
                    'Força Indomável',
                    'Melhoria de Atributo',
                    'Campeão Primitivo',
                ],
                cantripsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                spellSlotsPerSpellLevel: {
                    isValidToThisClass: false,
                    spellLevel: [],
                    spellSpaces: [],
                },
                spellsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                kiPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                martialArts: {
                    isValidToThisClass: false,
                    amount: [],
                },
                unarmoredMovement: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sneakAttack: {
                    isValidToThisClass: false,
                    amount: [],
                },
                sorceryPoints: {
                    isValidToThisClass: false,
                    amount: [],
                },
                invocationsKnown: {
                    isValidToThisClass: false,
                    amount: [],
                },
                rages: {
                    isValidToThisClass: true,
                    amount: [
                        2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 999,
                    ],
                },
                rageDamage: {
                    isValidToThisClass: true,
                    amount: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
                },
            },
            characteristics: [
                {
                    title: 'Raiva',
                    description:
                        'Na batalha, você luta com ferocidade primal. Em seu turno, você pode entrar em uma raiva como uma ação bônus.\n\nEnquanto está em raiva, você ganha os seguintes benefícios se não estiver usando armadura pesada:\n\nVocê tem vantagem em testes de Força e em testes de resistência de Força.\n\nQuando você faz um ataque com arma corpo a corpo usando Força, você ganha um bônus no dano que aumenta conforme você ganha níveis de bárbaro, como mostrado na coluna Dano da Raiva na tabela do Bárbaro.\n\nVocê tem resistência a dano contundente, perfurante e cortante.\n\nSe você for capaz de conjurar magias, não pode conjurá-las nem concentrar-se nelas enquanto estiver em raiva.\n\nSua raiva dura 1 minuto. Ela termina antecipadamente se você for derrubado inconsciente ou se seu turno terminar e você não tiver atacado uma criatura hostil desde seu último turno ou sofrido dano desde então. Você também pode encerrar sua raiva em seu turno como uma ação bônus.\n\nDepois de ter usado a raiva o número de vezes mostrado para seu nível de bárbaro na coluna Raivas da tabela do Bárbaro, você precisa terminar um descanso longo antes de poder usar a raiva novamente.',
                },
                {
                    title: 'Defesa Inarmada',
                    description:
                        'Enquanto você não estiver usando qualquer armadura, sua Classe de Armadura é igual a 10 + seu modificador de Destreza + seu modificador de Constituição. Você pode usar um escudo e ainda obter esse benefício.',
                },
                {
                    title: 'Ataque Despreocupado',
                    description:
                        'A partir do 2º nível, você pode deixar de lado toda preocupação com defesa para atacar com uma fúria feroz. Quando você fizer seu primeiro ataque em seu turno, você pode decidir atacar despreocupadamente. Ao fazer isso, você tem vantagem em rolagens de ataque com arma corpo a corpo usando Força durante este turno, mas rolagens de ataque contra você têm vantagem até o seu próximo turno.',
                },
                {
                    title: 'Sentido de Perigo',
                    description:
                        'No 2º nível, você desenvolve um sentido inigualável para quando as coisas ao seu redor não estão como deveriam, o que lhe dá uma vantagem ao se esquivar do perigo.\n\nVocê tem vantagem em testes de resistência de Destreza contra efeitos que você pode ver, como armadilhas e magias. Para obter esse benefício, você não pode estar cego, surdo ou incapacitado.',
                },
                {
                    title: 'Caminho Primitivo',
                    description:
                        'No 3º nível, você escolhe um caminho que molda a natureza de sua raiva. Escolha o Caminho do Berserker ou o Caminho do Guerreiro Totêmico, ambos detalhados no final da descrição da classe. Sua escolha concede características a você no 3º nível e novamente nos níveis 6, 10 e 14.',
                },
                {
                    title: 'Melhoria de Atributo',
                    description:
                        'Quando você atinge o 4º nível e novamente no 8º, 12º, 16º e 19º nível, você pode aumentar um atributo de sua escolha em 2, ou pode aumentar dois atributos de sua escolha em 1. Como de costume, você não pode aumentar um atributo acima de 20 usando esse recurso.',
                },
                {
                    title: 'Ataque Extra',
                    description:
                        'A partir do 5º nível, você pode atacar duas vezes, em vez de uma, sempre que executar a ação Atacar em seu turno.',
                },
                {
                    title: 'Movimento Rápido',
                    description:
                        'A partir do 5º nível, sua velocidade aumenta em 3 metros enquanto você não estiver usando armadura pesada.',
                },
                {
                    title: 'Instinto Selvagem',
                    description:
                        'Aos 7º nível, seus instintos estão tão apurados que você tem vantagem em rolagens de iniciativa.\n\nAlém disso, se você estiver surpreso no início do combate e não estiver incapacitado, você pode agir normalmente em seu primeiro turno, mas somente se você entrar em sua raiva antes de fazer qualquer outra coisa naquele turno.',
                },
                {
                    title: 'Crítico Brutal',
                    description:
                        'A partir do 9º nível, você pode rolar um dado de dano adicional ao determinar o dano extra para um acerto crítico com um ataque corpo a corpo.\n\nIsso aumenta para dois dados adicionais no 13º nível e três dados adicionais no 17º nível.',
                },
                {
                    title: 'Raiva Implacável',
                    description:
                        'A partir do 11º nível, sua raiva pode mantê-lo lutando mesmo com ferimentos graves. Se você chegar a 0 pontos de vida enquanto estiver em raiva e não morrer imediatamente, poderá fazer um teste de resistência de Constituição CD 10. Se tiver sucesso, em vez disso, você cairá a 1 ponto de vida.\n\nCada vez que você usa essa característica depois da primeira, a CD aumenta em 5. Quando você termina um descanso curto ou longo, a CD é redefinida para 10.',
                },
                {
                    title: 'Raiva Persistente',
                    description:
                        'A partir do 15º nível, sua raiva é tão intensa que ela termina antecipadamente apenas se você ficar inconsciente ou se escolher terminá-la.',
                },
                {
                    title: 'Força Indomável',
                    description:
                        'A partir do 18º nível, se o total de um teste de Força for inferior ao seu valor de Força, você pode usar esse valor no lugar do total.',
                },
                {
                    title: 'Campeão Primitivo',
                    description:
                        'No 20º nível, você personifica o poder das terras selvagens. Seus valores de Força e Constituição aumentam em 4. Seus valores máximos para esses atributos agora são 24.',
                },
                {
                    title: 'Caminho do Berserker',
                    description:
                        'Para alguns bárbaros, a raiva é um meio para um fim - esse fim sendo a violência. O Caminho do Berserker é um caminho de fúria indomada, encharcado de sangue. Ao entrar na raiva do berserker, você se delicia no caos da batalha, sem se importar com sua própria saúde ou bem-estar.',
                },
                {
                    title: 'Frenesi',
                    description:
                        'A partir do 6º nível, você não pode ser encantado ou amedrontado enquanto estiver em raiva. Se você estiver encantado ou amedrontado quando entrar em sua raiva, o efeito é suspenso durante a duração da raiva.',
                },
                {
                    title: 'Fúria Sem Mente',
                    description:
                        'A partir do 6º nível, você não pode ser encantado ou amedrontado enquanto estiver em fúria. Se você estiver encantado ou amedrontado quando entrar em fúria, o efeito é suspenso durante a duração da fúria.',
                },
                {
                    title: 'Presença Intimidadora',
                    description:
                        'A partir do 10º nível, você pode usar sua ação para amedrontar alguém com sua presença ameaçadora. Ao fazer isso, escolha uma criatura que você possa ver a até 9.1 metros de você. Se a criatura puder ver ou ouvir você, ela deve ter sucesso em um teste de resistência de Sabedoria (CD igual a 8 + seu bônus de proficiência + seu modificador de Carisma) ou ficar amedrontada por você até o final de seu próximo turno. Em turnos subsequentes, você pode usar sua ação para estender a duração desse efeito na criatura amedrontada até o final de seu próximo turno. Esse efeito termina se a criatura terminar seu turno fora do alcance da sua visão ou a mais de 18.2 metros de você.\n\nSe a criatura tiver sucesso em seu teste de resistência, você não pode usar essa característica novamente nessa criatura durante 24 horas.',
                },
                {
                    title: 'Retaliação',
                    description:
                        'A partir do 14º nível, quando você sofrer dano de uma criatura que esteja a até 1.5 metros de você, você pode usar sua reação para fazer um ataque corpo a corpo contra essa criatura.',
                },
            ],
            subClass: [
                {
                    title: 'Trilha da Besta',
                    description:
                        'Transforme-se em uma besta com ataques desarmados mortais.',
                    characteristics: [
                        {
                            title: 'Forma da Fera',
                            description:
                                'Você pode se transformar, revelando o poder bestial dentro de você. Escolha mordida, garra ou cauda como forma de ataque',
                        },
                    ],
                },
            ],
        },
    };
}

function createGodsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<God> & { godId: string } {
    return {
        godId: entityId || newUUID(),
        active: true,
        en: {
            name: 'The Daghdha, god of weather and crops',
            alignment: 'CG',
            suggestedDomains: 'Nature, Trickery',
            symbol: 'Bubbling cauldron or shield',
            pantheon: 'Celtic',
        },
        pt: {
            name: 'O Daghdha, deus do clima e das colheitas',
            alignment: 'CG',
            suggestedDomains: 'Natureza, Trapaça',
            symbol: 'Caldeirão borbulhante ou escudo',
            pantheon: 'Céltico',
        },
    };
}

function createMagicItemsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<MagicItem> & { magicItemId: string } {
    return {
        magicItemId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Adamantine Armor',
            characteristics: ['Armor (medium or heavy, but not hide)', 'uncommon'],
            description:
                "This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.",
        },
        pt: {
            name: 'Armadura de Adamantina',
            characteristics: ['Armadura (média ou pesada, mas não de couro)', 'incomum'],
            description:
                'Esta armadura é reforçada com adamantina, uma das substâncias mais duras que existem. Enquanto estiver usando-a, qualquer acerto crítico contra você se torna um acerto normal.',
        },
    };
}

function createMonstersFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Monster> & { monsterId: string } {
    return {
        monsterId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Aboleth',
            characteristics: ['large aberration', 'lawful evil'],
            stats: {
                armorClass: 17,
                hitPoints: {
                    hitDice: '18d10 + 36',
                    default: 135,
                },
                speed: '10 feet, swim 40 feet',
                savingThrows: [
                    {
                        name: 'constitution',
                        value: 6,
                    },
                    {
                        name: 'intelligence',
                        value: 8,
                    },
                    {
                        name: 'wisdom',
                        value: 6,
                    },
                ],
                damageImmunities: [],
                conditionImmunities: [],
                damageResistances: [],
                senses: ['darkvision 120 feet, passive Perception 20'],
                languages: ['deep speech', 'telepathy 120 feet'],
                challengeLevel: 10,
            },
            abilityScore: [
                {
                    name: 'strength',
                    value: 21,
                    modifier: 5,
                },
                {
                    name: 'dexterity',
                    value: 9,
                    modifier: -1,
                },
                {
                    name: 'constitution',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'intelligence',
                    value: 18,
                    modifier: 4,
                },
                {
                    name: 'wisdom',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'charism',
                    value: 18,
                    modifier: 4,
                },
            ],
            skills: [
                {
                    name: 'Amphibious',
                    description: 'The aboleth can breathe air and water.',
                },
                {
                    name: 'Mucous Cloud',
                    description:
                        'While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.',
                },
                {
                    name: 'Probing Telepathy',
                    description:
                        "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
                },
            ],
            actions: [
                {
                    name: 'Multiattack',
                    description: 'The aboleth makes three tentacle attacks.',
                    type: 'common',
                },
                {
                    name: 'Tentacle',
                    description:
                        "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
                    type: 'common',
                },
                {
                    name: 'Tail',
                    description:
                        'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) bludgeoning damage.',
                    type: 'common',
                },
                {
                    name: 'Enslave (3/Day)',
                    description:
                        "The aboleth targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\n\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.",
                    type: 'common',
                },
                {
                    name: 'Legendary Actions',
                    description:
                        "The aboleth can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The aboleth regains spent legendary actions at the start of its turn.",
                    type: 'legendary',
                },
                {
                    name: 'Detect',
                    description: 'The aboleth makes a Wisdom (Perception) check.',
                    type: 'legendary',
                },
                {
                    name: 'Tail Swipe',
                    description: 'The aboleth makes one tail attack.',
                    type: 'legendary',
                },
                {
                    name: 'Psychic Drain (Costs 2 Actions)',
                    description:
                        'One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.',
                    type: 'legendary',
                },
            ],
            picture: 'https://i.ibb.co/GMGdPht/tumblr-oh3dew-Z0-RW1v9qvuco1-1280.jpg',
        },
        pt: {
            name: 'Aboleth',
            characteristics: ['grande aberração', 'malígno e leal'],
            stats: {
                armorClass: 17,
                hitPoints: {
                    hitDice: '18d10 + 36',
                    default: 135,
                },
                speed: '3 metros, nadar 12.1 metros',
                savingThrows: [
                    {
                        name: 'constituição',
                        value: 6,
                    },
                    {
                        name: 'inteligência',
                        value: 8,
                    },
                    {
                        name: 'sabedoria',
                        value: 6,
                    },
                ],
                damageImmunities: [],
                conditionImmunities: [],
                damageResistances: [],
                senses: ['visão no escuro 36.5 metros, Percepção passiva 20'],
                languages: ['fala profunda', 'telepatia 36.5 metros'],
                challengeLevel: 10,
            },
            abilityScore: [
                {
                    name: 'força',
                    value: 21,
                    modifier: 5,
                },
                {
                    name: 'destreza',
                    value: 9,
                    modifier: -1,
                },
                {
                    name: 'constituição',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'inteligência',
                    value: 18,
                    modifier: 4,
                },
                {
                    name: 'sabedoria',
                    value: 15,
                    modifier: 2,
                },
                {
                    name: 'carisma',
                    value: 18,
                    modifier: 4,
                },
            ],
            skills: [
                {
                    name: 'Anfíbio',
                    description: 'O aboleth pode respirar ar e água.',
                },
                {
                    name: 'Nuvem de Muco',
                    description:
                        "Enquanto estiver submerso, o aboleth é cercado por um muco transformador. Uma criatura que toque o aboleth ou o atinja com um ataque corpo-a-corpo a até 1.5 metros dele deve fazer um teste de resistência de Constituição CD 14. Em caso de falha, a criatura fica doente por 1d4 horas e só pode respirar debaixo d'água.",
                },
                {
                    name: 'Telepatia de Sonda',
                    description:
                        'Se uma criatura se comunicar telepaticamente com o aboleth, o aboleth descobre os maiores desejos da criatura, se puder vê-la.',
                },
            ],
            actions: [
                {
                    name: 'Multiataque',
                    description: 'O aboleth faz três ataques com seus tentáculos.',
                    type: 'comum',
                },
                {
                    name: 'Tentáculo',
                    description:
                        "Ataque Corpo-a-Corpo: +9 para atingir, alcance 3 metros, um alvo. Acerto: 12 (2d6 + 5) de dano concussão. Se o alvo for uma criatura, ele deve ser bem-sucedido em um teste de resistência de Constituição CD 14 ou ficará doente. A doença não tem efeito durante 1 minuto e pode ser removida por qualquer magia que cure doenças. Após 1 minuto, a pele da criatura doente fica translúcida e viscosa, e ela não pode recuperar pontos de vida, a menos que esteja debaixo d'água, e a doença só pode ser removida por magia cura ou outra magia de cura de doenças de 6º nível ou superior. Quando a criatura está fora da água, ela sofre 6 (1d12) de dano ácido a cada 10 minutos, a menos que a pele seja umedecida antes de 10 minutos passarem.",
                    type: 'comum',
                },
                {
                    name: 'Cauda',
                    description:
                        'Ataque Corpo-a-Corpo: +9 para atingir, alcance 3 metros, um alvo. Acerto: 15 (3d6 + 5) de dano concussão.',
                    type: 'comum',
                },
                {
                    name: 'Escravizar (3/Vezes ao Dia)',
                    description:
                        'O aboleth escolhe uma criatura que pode ver a até 9.1 metros dele. O alvo deve ser bem-sucedido em um teste de resistência de Sabedoria CD 14 ou ficará enfeitiçado magicamente pelo aboleth até que o aboleth morra ou até que o alvo esteja em um plano diferente de existência em relação ao aboleth. O alvo enfeitiçado está sob o controle do aboleth e não pode reagir, e o aboleth e o alvo podem se comunicar telepaticamente um com o outro, em qualquer distância.\n\nSempre que o alvo enfeitiçado sofrer dano, ele pode repetir o teste de resistência. Em caso de sucesso, o efeito termina. No máximo uma vez a cada 24 horas, o alvo pode repetir o teste de resistência quando estiver a pelo menos 1 milha do aboleth.',
                    type: 'comum',
                },
                {
                    name: 'Ações Lendárias',
                    description:
                        'O aboleth pode fazer 3 ações lendárias, escolhendo entre as opções abaixo. Somente uma opção de ação lendária pode ser usada de cada vez e somente no final do turno de outra criatura. O aboleth recupera as ações lendárias gastas no início de seu turno.',
                    type: 'lendário',
                },
                {
                    name: 'Detectar',
                    description: 'O aboleth faz um teste de Sabedoria (Percepção).',
                    type: 'lendário',
                },
                {
                    name: 'Golpe de Cauda',
                    description: 'O aboleth faz um ataque com a cauda.',
                    type: 'lendário',
                },
                {
                    name: 'Dreno Psíquico (Custa 2 Ações)',
                    description:
                        'Uma criatura enfeitiçada pelo aboleth sofre 10 (3d6) de dano psíquico, e o aboleth recupera pontos de vida iguais ao dano causado à criatura.',
                    type: 'lendário',
                },
            ],
            picture: 'https://i.ibb.co/GMGdPht/tumblr-oh3dew-Z0-RW1v9qvuco1-1280.jpg',
        },
    };
}

function createItemsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Item> & { itemId: string } {
    return {
        itemId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Abacus',
            description: '2',
            cost: {
                currency: 'gp',
                value: 2,
            },
            type: 'adventuring gear',
            weight: 0.9,
            mountOrVehicle: {
                isValid: false,
                speed: '2',
                carryingCapacity: '2',
            },
            tradeGoods: {
                isValid: false,
                goods: '2',
            },
        },
        pt: {
            name: 'Ábaco',
            description: '2',
            cost: {
                currency: 'po',
                value: 2,
            },
            type: 'equipamento de aventura',
            weight: 0.9,
            mountOrVehicle: {
                isValid: false,
                speed: '2',
                carryingCapacity: '2',
            },
            tradeGoods: {
                isValid: false,
                goods: '2',
            },
        },
    };
}

function createRacesFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Race> & { raceId: string } {
    return {
        raceId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Dwarf',
            description:
                "Where is my boot? I need to go to the mines to check on the progress of the Ruby extraction, said the Dwarf King to the Queen, who was reading a letter directly from the Elven Kingdom. My love, the Queen said, the Elf King is requesting a visit to our kingdom to negotiate some diamond mines. Do these pointy-eared ones think our things are for sale whenever they want? That's not how things work! - Bornovok III, King of the Dwarf Kingdom, holder of the Avirath orb.\n\nDwarves are an incredibly resilient race, known for their mining abilities. Dwarves are widely sought after for dealing with weapons, jewelry, and other magical tools, as they possess vast reserves of magical items and extensive knowledge of weapon crafting and other objects.\n\nThe Dwarf Kingdom is incredibly beautiful, with its castle being a tourist attraction for people from all over the world. It is said that the throne room of this castle is entirely made of pure gold, and the throne itself is constructed from ruby and diamond stones!\n\nAlthough they are extremely serious when it comes to mining and their creations, dwarves (for the most part) are very kind to those who are kind to them. But make no mistake, they know how to defend themselves, and if there's a people who can wreak havoc with magical weapons when provoked, it's the dwarf people.",
            abilityScoreIncrease: [
                {
                    name: 'Constitution',
                    value: 2,
                } as AbilityScoreIncrease,
            ],
            size: 'small',
            tale: 'bold heroes',
            ageMax: 350,
            alignment: ['lawful', 'good'],
            heightMax: 1.2,
            weightMax: 68,
            speed: [7.6, 'speed not reduced by wearing heavy armor'],
            language: ['Common', 'Dwarvish'],
            subRaces: [
                {
                    name: 'Hill Dwarf',
                    description:
                        'Hill Dwarves are remarkably resilient and wise. Their lives in the hills of the kingdom make them excellent explorers, which gives these dwarves a strong instinct for survival and intuition.',
                    abilityScoreIncrease: [
                        {
                            name: 'Wisdom',
                            value: 1,
                        },
                    ],
                    characteristics: [
                        {
                            name: 'Dwarven Toughness',
                            description:
                                'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.',
                        },
                    ],
                },
                {
                    name: 'Mystic Dwarf',
                    description:
                        'Mystic Dwarves are well-versed in the magical arts. Over time, these dwarves have separated themselves from the others as they have no interest in mining or craftsmanship, but rather in using the products of these activities for study and, for some, power.\n\nBecause their studies and practice of magic are their main focus, these dwarves are generally slightly weaker and have a maximum average weight of 50 kg.',
                    abilityScoreIncrease: [
                        {
                            name: 'Intelligence',
                            value: 2,
                        },
                    ],
                    characteristics: [
                        {
                            name: 'Lack of Strength',
                            description:
                                'You have disadvantage on strength checks related to objects, such as pulling, pushing, and carrying.',
                        },
                        {
                            name: 'Magic Specialist',
                            description:
                                'When using any magical item, you can roll 1d2 (lucky dice) to determine if that item was made by a dwarf or not. If it was made by a dwarf, your expertise in Dwarf Magic comes into play, you gain advantage on rolls involving that magical item.',
                        },
                    ],
                },
            ],
            skillProficiencies: [],
            characteristics: [
                {
                    name: 'Darkvision',
                    description:
                        'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.',
                    suggested: {
                        personalityTrait: ['personality'],
                        ideal: ['ideal'],
                        bond: ['bond'],
                        flaw: ['flaw'],
                    },
                },
                {
                    name: 'Dwarven Resilience',
                    description:
                        'You have advantage on saving throws against poison, and you have resistance against poison damage.',
                    suggested: {
                        personalityTrait: ['personality'],
                        ideal: ['ideal'],
                        bond: ['bond'],
                        flaw: ['flaw'],
                    },
                },
                {
                    name: 'Dwarven Combat Training',
                    description:
                        'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.',
                    suggested: {
                        personalityTrait: ['personality'],
                        ideal: ['ideal'],
                        bond: ['bond'],
                        flaw: ['flaw'],
                    },
                },
                {
                    name: 'Tool Proficiency',
                    description:
                        'You gain proficiency with the artisan’s tools of your choice: smith’s tools, brewer’s supplies, or mason’s tools.',
                    suggested: {
                        personalityTrait: ['personality'],
                        ideal: ['ideal'],
                        bond: ['bond'],
                        flaw: ['flaw'],
                    },
                },
                {
                    name: 'Stonecunning',
                    description:
                        'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.',
                    suggested: {
                        personalityTrait: ['personality'],
                        ideal: ['ideal'],
                        bond: ['bond'],
                        flaw: ['flaw'],
                    },
                },
            ],
        },
        pt: {
            name: 'Anão',
            description:
                'Onde está minha bota? Preciso ir às minas verificar o andamento da extração de Rubi, disse o Rei Anão para a Rainha, que estava lendo uma carta vinda diretamente do Reino dos Elfos. Meu amor, disse a Rainha, o Rei Elfo está solicitando uma visita ao nosso reino para negociar algumas minas de diamante. Esses orelhas pontudas acham que nossas coisas estão à venda sempre que desejam? Não é assim que as coisas funcionam! - Bornovok III, Rei do Reino Anão, portador da orbe de Avirath.\n\nOs anões são uma raça incrivelmente resiliente, conhecida por suas habilidades em mineração. Os anões são amplamente procurados para lidar com armas, joias e outras ferramentas mágicas, pois possuem vastas reservas de itens mágicos e amplo conhecimento em confecção de armas e outros objetos.\n\nO Reino Anão é incrivelmente bonito, sendo seu castelo uma atração turística para pessoas de todo o mundo. Dizem que a sala do trono deste castelo é inteiramente feita de ouro puro, e o trono em si é construído a partir de pedras de rubi e diamante!\n\nEmbora sejam extremamente sérios quando se trata de mineração e suas criações, os anões (na maioria das vezes) são muito gentis com aqueles que são gentis com eles. Mas não se engane, eles sabem se defender, e se há um povo que pode causar estragos com armas mágicas quando provocados, são os anões.',
            size: 'small',
            tale: 'bold heroes',
            abilityScoreIncrease: [
                {
                    name: 'Constituição',
                    value: 2,
                },
            ],
            ageMax: 350,
            alignment: ['leal', 'bom'],
            heightMax: 1.2,
            weightMax: 68,
            speed: [7.6, 'velocidade não reduzida ao usar armadura pesada'],
            language: ['Comum', 'Anão'],
            subRaces: [
                {
                    name: 'Anão da Colina',
                    description:
                        'Anões da colina são notavelmente resistentes e sábios. Sua vida nas colinas do reino os coloca à frente no quesito exploração, o que dá a esses anões um grande instinto de sobrevivência e intuição.',
                    abilityScoreIncrease: [
                        {
                            name: 'Sabedoria',
                            value: 1,
                        },
                    ],
                    characteristics: [
                        {
                            name: 'Resistência Anã',
                            description:
                                'Seu máximo de pontos de vida aumenta em 1, e aumenta em 1 a cada vez que você ganha um nível.',
                        },
                    ],
                },
                {
                    name: 'Anão Místico',
                    description:
                        'Anões místicos são versados nas artes mágicas. Com o tempo, esses anões se separaram dos demais, pois não têm interesse em mineração ou artesanato, mas sim em utilizar os produtos dessas atividades para estudo e, para alguns, poder.\n\nPor terem os estudos e prática da magia como seu foco principal, esses anões geralmente são um pouco mais fracos e têm um peso médio máximo de 50 kg.',
                    abilityScoreIncrease: [
                        {
                            name: 'Inteligência',
                            value: 2,
                        },
                    ],
                    characteristics: [
                        {
                            name: 'Falta de Força Anã',
                            description:
                                'Você tem desvantagem em testes de força relacionados a objetos, como puxar, empurrar e carregar.',
                        },
                        {
                            name: 'Especialista em Magia',
                            description:
                                'Ao utilizar qualquer item mágico você pode rolar 1d2 (dado de sorte) para descobrir se aquele item foi feito por um anão ou não. Caso tenha sido feito por um anão, sua expertise em Magia Anã entra em ação e você ganha vantagem em rolagens que envolvam esse item mágico.',
                        },
                    ],
                },
            ],
            skillProficiencies: [],
            characteristics: [
                {
                    name: 'Visão no Escuro',
                    description:
                        'Acostumado à vida subterrânea, você possui uma visão superior em condições de escuridão e pouca luz. Você pode enxergar em luz fraca em um raio de 18 metros como se fosse luz plena, e em escuridão como se fosse luz fraca. Você não consegue distinguir cores na escuridão, apenas tons de cinza.',
                    suggested: {
                        personalityTrait: ['personalidade'],
                        ideal: ['ideal'],
                        bond: ['laço'],
                        flaw: ['desvantagem'],
                    },
                },
                {
                    name: 'Resistência Anã',
                    description:
                        'Você possui vantagem em testes de resistência contra veneno e possui resistência a danos por veneno.',
                    suggested: {
                        personalityTrait: ['personalidade'],
                        ideal: ['ideal'],
                        bond: ['laço'],
                        flaw: ['desvantagem'],
                    },
                },
                {
                    name: 'Treinamento em Combate Anão',
                    description:
                        'Você possui proficiência com o machado de guerra, machadinho, martelo leve e martelo de guerra.',
                    suggested: {
                        personalityTrait: ['personalidade'],
                        ideal: ['ideal'],
                        bond: ['laço'],
                        flaw: ['desvantagem'],
                    },
                },
                {
                    name: 'Proficiência em Ferramentas',
                    description:
                        'Você ganha proficiência com ferramentas de artesão à sua escolha: ferramentas de ferreiro, suprimentos de cervejeiro ou ferramentas de pedreiro.',
                    suggested: {
                        personalityTrait: ['personalidade'],
                        ideal: ['ideal'],
                        bond: ['laço'],
                        flaw: ['desvantagem'],
                    },
                },
                {
                    name: 'Inteligência em Rochas',
                    description:
                        'Sempre que fizer um teste de Inteligência (História) relacionado à origem de estruturas de pedra, você é considerado proficiente na habilidade de História e adiciona o dobro do seu bônus de proficiência ao teste, em vez do seu bônus de proficiência normal.',
                    suggested: {
                        personalityTrait: ['personalidade'],
                        ideal: ['ideal'],
                        bond: ['laço'],
                        flaw: ['desvantagem'],
                    },
                },
            ],
        },
    };
}

function createRealmsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Realm> & { realmId: string } {
    return {
        realmId: entityId || newUUID(),
        active: true,
        en: {
            name: 'The Material Plane',
            description:
                'The Material Plane is the nexus where the philosophical and elemental forces that define the other planes collide in the jumbled existence of mortal life and mundane matter. All fantasy gaming worlds exist within the Material Plane, making it the starting point for most campaigns and adventures. The rest of the multiverse is defined in relation to the Material Plane.\n\nThe worlds of the Material Plane are infinitely diverse, for they reflect the creative imagination of the GMs who set their games there, as well as the players whose heroes adventure there. They include magic-wasted desert planets and island-dotted water worlds, worlds where magic combines with advanced technology and others trapped in an endless Stone Age, worlds where the gods walk and places they have abandoned.',
            thumbnail: 'https://i.ibb.co/MkSDFng/Material-Plane.png',
        },
        pt: {
            name: 'O Plano Material',
            description:
                'O Plano Material é o ponto de encontro onde as forças filosóficas e elementais que definem os outros planos colidem na existência confusa da vida mortal e da matéria mundana. Todos os mundos de jogos de fantasia existem dentro do Plano Material, tornando-o o ponto de partida para a maioria das campanhas e aventuras. O restante do multiverso é definido em relação ao Plano Material.\n\nOs mundos do Plano Material são infinitamente diversos, pois refletem a imaginação criativa dos Mestres do Jogo que estabelecem seus jogos lá, assim como dos jogadores cujos heróis aventuram-se ali. Eles incluem planetas desérticos devastados pela magia e mundos aquáticos salpicados de ilhas, mundos onde a magia se combina com tecnologia avançada e outros presos em uma Idade da Pedra interminável, mundos onde os deuses caminham e lugares que eles abandonaram.',
            thumbnail: 'https://i.ibb.co/MkSDFng/Material-Plane.png',
        },
    };
}

function createWikisFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Wiki> & { wikiId: string } {
    return {
        wikiId: entityId || newUUID(),
        active: true,
        en: {
            title: 'Races',
            description: '',
            subTopics: [
                {
                    subTitle: 'Racial Traits',
                    description:
                        'The description of each race includes racial traits that are common to members of that race. The following entries appear among the traits of most races.',
                },
                {
                    subTitle: 'Ability Score Increase',
                    description:
                        "Every race increases one or more of a character's ability scores.",
                },
                {
                    subTitle: 'Age',
                    description:
                        "The age entry notes the age when a member of the race is considered an adult, as well as the race's expected lifespan. This information can help you decide how old your character is at the start of the game. You can choose any age for your character, which could provide an explanation for some of your ability scores. For example, if you play a young or very old character, your age could explain a particularly low Strength or Constitution score, while advanced age could account for a high Intelligence or Wisdom.",
                },
                {
                    subTitle: 'Alignment',
                    description:
                        'Most races have tendencies toward certain alignments, described in this entry. These are not binding for player characters, but considering why your dwarf is chaotic, for example, in defiance of lawful dwarf society can help you better define your character.',
                },
                {
                    subTitle: 'Size',
                    description:
                        'Characters of most races are Medium, a size category including creatures that are roughly 4 to 8 feet tall. Members of a few races are Small (between 2 and 4 feet tall), which means that certain rules of the game affect them differently. The most important of these rules is that Small characters have trouble wielding heavy weapons, as explained in “Equipment.”',
                },
                {
                    subTitle: 'Speed',
                    description:
                        "Your speed determines how far you can move when traveling ('Adventuring') and fighting ('Combat').",
                },
                {
                    subTitle: 'Languages',
                    description:
                        'By virtue of your race, your character can speak, read, and write certain languages.',
                },
                {
                    subTitle: 'Subraces',
                    description:
                        'Some races have subraces. Members of a subrace have the traits of the parent race in addition to the traits specified for their subrace. Relationships among subraces vary significantly from race to race and world to world.',
                },
            ],
            reference: 'SRD D&D 5e - pg. 3',
            image: 'https://i.ibb.co/r3ZB3vR/wp2770237-dd-wallpaper.jpg',
        },
        pt: {
            title: 'Raças',
            description: '',
            subTopics: [
                {
                    subTitle: 'Traços Raciais',
                    description:
                        'A descrição de cada raça inclui traços raciais que são comuns aos membros dessa raça. As seguintes entradas aparecem entre os traços da maioria das raças.',
                },
                {
                    subTitle: 'Aumento de Atributos',
                    description: 'Cada raça aumenta um ou mais atributos do personagem.',
                },
                {
                    subTitle: 'Idade',
                    description:
                        'A entrada de idade indica a idade em que um membro da raça é considerado adulto, bem como a expectativa de vida da raça. Essas informações podem ajudar a decidir a idade do seu personagem no início do jogo. Você pode escolher qualquer idade para o seu personagem, o que pode explicar alguns dos seus atributos. Por exemplo, se você interpretar um personagem jovem ou muito idoso, a idade pode explicar um atributo de Força ou Constituição particularmente baixo, enquanto uma idade avançada pode justificar um alto atributo de Inteligência ou Sabedoria.',
                },
                {
                    subTitle: 'Alinhamento',
                    description:
                        'A maioria das raças tem tendências para certos alinhamentos. Essas tendências não são obrigatórias para personagens jogadores, mas considerar por que seu anão é caótico, por exemplo, em desafio à sociedade anã ordeira, pode ajudá-lo a definir melhor o seu personagem.',
                },
                {
                    subTitle: 'Tamanho',
                    description:
                        "Personagens da maioria das raças são de tamanho Médio, uma categoria de tamanho que inclui criaturas com aproximadamente 1,2 a 2,4 metros de altura. Membros de algumas raças são de tamanho Pequeno (entre 0,6 a 1,2 metros de altura), o que significa que certas regras do jogo os afetam de forma diferente. A regra mais importante é que personagens Pequenos têm dificuldade em empunhar armas pesadas, como explicado em 'Equipamento'.",
                },
                {
                    subTitle: 'Velocidade',
                    description:
                        "Sua velocidade determina o quão longe você pode se mover ao viajar ('Aventurar-se') e ao lutar ('Combate').",
                },

                {
                    subTitle: 'Idiomas',
                    description:
                        'Por causa de sua raça, seu personagem pode falar, ler e escrever certos idiomas.',
                },

                {
                    subTitle: 'Sub-raças',
                    description:
                        'Algumas raças possuem sub-raças. Membros de uma sub-raça possuem os traços da raça principal, além dos traços especificados para sua sub-raça. As relações entre as sub-raças variam significativamente de raça para raça e de mundo para mundo.',
                },
            ],
            reference: 'SRD D&D 5e - pg. 3',
            image: 'https://i.ibb.co/r3ZB3vR/wp2770237-dd-wallpaper.jpg',
        },
    };
}

function createWeaponsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Weapon> & { weaponId: string } {
    return {
        weaponId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Club',
            description: '',
            cost: {
                currency: 'sp',
                value: 1,
            },
            type: 'simple melee weapon',
            weight: 0.9,
            damage: '1d4 bludgeoning',
            properties: ['light'],
        },
        pt: {
            name: 'Clava',
            description: '',
            cost: {
                currency: 'po',
                value: 1,
            },
            type: 'arma branca simples',
            weight: 0.9,
            damage: '1d4 de concussão',
            properties: ['leve'],
        },
    };
}

function createSpellsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Spell> & { spellId: string } {
    return {
        spellId: entityId || newUUID(),
        active: true,
        en: {
            name: 'Dancing Light',
            description:
                "You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius.\n\nAs a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this spell, and a light winks out if it exceeds the spell's range.",
            type: 'evocation-cantrip',
            level: 0,
            higherLevels: [],
            damage: null,
            castingTime: '1 action',
            duration: 'concentration, up to 1 minute',
            range: '120 feet',
            components: 'V, S, M (a bit of phosphorus or wychwood, or a glowworm)',
            buffs: ['no-buff'],
            debuffs: ['no-debuffs'],
        },
        pt: {
            name: 'Luz Dançante',
            description:
                'Você cria até quatro luzes do tamanho de tochas dentro do alcance, fazendo-as parecer tochas, lanternas ou orbes brilhantes que flutuam no ar durante a duração. Você também pode combinar as quatro luzes em uma forma vagamente humanoides brilhante de tamanho Médio. Independentemente da forma escolhida, cada luz emite uma luz fraca em um raio de 3 metros.\n\nComo uma ação bônus em seu turno, você pode mover as luzes até 18 metros para um novo local dentro do alcance. Uma luz deve estar a até 6 metros de outra luz criada por este feitiço, e uma luz se apaga se ultrapassar o alcance do feitiço.',
            type: 'evocação-cantrip',
            level: 0,
            higherLevels: [],
            damage: null,
            castingTime: '1 ação',
            duration: 'concentração, até 1 minuto',
            range: '36.5 metros',
            components: 'V, S, M (um pouco de fósforo ou madeira mágica, ou um vagalume)',
            buffs: ['no-buff'],
            debuffs: ['no-debuffs'],
        },
    };
}

const dungeonsAndDragonsFunctions = {
    armors: createArmorsFaker,
    backgrounds: createBackgroundsFaker,
    classes: createClassesFaker,
    feats: createFeatsFaker,
    gods: createGodsFaker,
    magicItems: createMagicItemsFaker,
    monsters: createMonstersFaker,
    items: createItemsFaker,
    races: createRacesFaker,
    realms: createRealmsFaker,
    wikis: createWikisFaker,
    weapons: createWeaponsFaker,
    spells: createSpellsFaker,
};

export default function generateDungeonsAndDragonsFaker({
    count,
    entityId,
    entity,
}: {
    count: number;
    entityId: string | undefined;
    entity: string | undefined;
}): any[] {
    const entityArray: Array<
        Internacional<
            | Armor
            | Background
            | Class
            | Feat
            | God
            | MagicItem
            | Monster
            | Item
            | Race
            | Realm
            | Wiki
            | Weapon
            | Spell
        >
    > = [];

    for (let index = 0; index <= count; index += 1) {
        entityArray.push(
            dungeonsAndDragonsFunctions[
                entity as keyof typeof dungeonsAndDragonsFunctions
            ]({
                entityId,
            } as { entityId: string })
        );
    }

    return entityArray;
}
