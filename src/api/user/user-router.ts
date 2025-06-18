import { Router } from 'express';
import * as controller from '@api/user/user-controller';
import {
  createUserSchema,
  updateUserSchema,
} from '@api/user/user-schema';
import { validateRequest } from '@api/middleware/validate-request';

const router = Router();

router.get('/', controller.findUserApi);
router.post('/', validateRequest(createUserSchema), controller.createUserApi);
router.put('/:id', validateRequest(updateUserSchema), controller.updateUserApi);

export default router;
