import { Router } from 'express';

import { validateQuery, validateRequest } from '@api/middleware/validate-request';
import * as controller from '@api/user/user-controller';
import {
  createUserSchema,
  findUserQuerySchema,
  updateUserSchema,
  userRegistrationchema
} from '@api/user/user-schema';

const router = Router();

router.get('/', validateQuery(findUserQuerySchema), controller.findUserApi);
router.post('/', validateRequest([createUserSchema, userRegistrationchema]), controller.createUserApi);
router.put('/:id', validateRequest(updateUserSchema), controller.updateUserApi);

export default router;
