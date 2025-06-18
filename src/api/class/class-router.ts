import { Router } from 'express';
import * as controller from '@api/class/class-controller';

const router = Router();

router.get('/', controller.findClassApi);

export default router;
