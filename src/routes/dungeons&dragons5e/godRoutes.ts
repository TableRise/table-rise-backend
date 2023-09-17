/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Router } from 'express';
import DatabaseManagement, { SchemasDnDType } from '@tablerise/database-management';
import GodsServices from 'src/services/dungeons&dragons5e/GodsServices';
import GodsControllers from 'src/controllers/dungeons&dragons5e/GodsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';
import ValidateData from 'src/support/helpers/ValidateData';
import VerifyBooleanQueryMiddleware from 'src/middlewares/VerifyBooleanQueryMiddleware';

import logger from '@tablerise/dynamic-logger';

const validateData = new ValidateData(logger);
const DM = new DatabaseManagement();

const model = DM.modelInstance('dungeons&dragons5e', 'Gods');
const schema = DM.schemaInstance('dungeons&dragons5e') as SchemasDnDType;

const services = new GodsServices(model, logger, validateData, schema);
const controllers = new GodsControllers(services, logger);

const router = Router();

router.get('/', controllers.findAll);
router.get('/disabled', controllers.findAllDisabled);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, VerifyBooleanQueryMiddleware, controllers.updateAvailability);

export default router;
