import { Router } from 'express';
import SystemsModel from 'src/database/models/SystemsModel';
import SystemsServices from 'src/services/SystemsServices';
import SystemsControllers from 'src/controllers/SystemsControllers';
import VerifyIdMiddleware from 'src/middlewares/VerifyIdMiddleware';

const model = new SystemsModel();
const services = new SystemsServices(model);
const controllers = new SystemsControllers(services);

const router = Router();

router.get('/', controllers.findAll);
router.get('/:id', VerifyIdMiddleware, controllers.findOne);
router.put('/:id', VerifyIdMiddleware, controllers.update);
router.patch('/:id', VerifyIdMiddleware, controllers.updateContent);
router.patch('/activate/:id', VerifyIdMiddleware, controllers.activate);
router.patch('/deactivate/:id', VerifyIdMiddleware, controllers.deactivate);

export default router;
