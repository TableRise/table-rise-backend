import ToggleWikisAvailabilityService from 'src/core/dungeons&dragons5e/services/Wikis/ToggleWikisAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleWikisAvailabilityOperationContract {
    toggleWikisAvailabilityService: ToggleWikisAvailabilityService;
    logger: Logger;
}

export interface ToggleWikisAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}