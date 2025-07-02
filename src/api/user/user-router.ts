import { Router } from 'express';
import * as controller from '@api/user/user-controller';
import {
  createUserSchema,
  findUserQuerySchema,
  updateUserSchema,
} from '@api/user/user-schema';
import { validateQuery, validateRequest } from '@api/middleware/validate-request';

const router = Router();

router.get('/', validateQuery(findUserQuerySchema), controller.findUserApi);
router.post('/', validateRequest(createUserSchema), controller.createUserApi);
router.put('/:id', validateRequest(updateUserSchema), controller.updateUserApi);

export default router;
