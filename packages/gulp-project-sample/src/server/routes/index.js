import {Router} from 'express';
import * as controller from '../controllers';

// setup router
const router = Router(); // eslint-disable-line new-cap

// registering routes
router.get('/README', controller.readme);

export default router;
