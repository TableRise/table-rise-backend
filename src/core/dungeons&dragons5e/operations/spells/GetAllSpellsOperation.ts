import { Spell } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetAllSpellsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/spells/GetAllSpells';

export default class GetAllSpellsOperation {
    private readonly _getAllSpellsService;
    private readonly _logger;

    constructor({ getAllSpellsService, logger }: GetAllSpellsOperationContract) {
        this._getAllSpellsService = getAllSpellsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Spell>>> {
        this._logger('info', 'Execute - GetAllSpellsOperation');
        const spells = await this._getAllSpellsService.getAll();

        return spells;
    }
}
