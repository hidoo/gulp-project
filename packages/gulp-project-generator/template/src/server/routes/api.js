import { Router } from 'express';
import * as controller from '../controllers/api.js';

// setup router
const router = Router(); // eslint-disable-line new-cap

// registering routes
router.get('/project', controller.project);

export default router;
