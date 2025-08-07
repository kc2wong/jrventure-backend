import { Router } from 'express';

import * as controller from '@api/achievement/achievement-controller';
import { createAchievementSchema, findAchievementQuerySchema, updateAchievementSchema } from '@api/achievement/achievement-schema';
import {
  validateRequest,
  validateQuery,
} from '@api/middleware/validate-request';

const router = Router();

router.get(
  '/',
  validateQuery(findAchievementQuerySchema),
  controller.findAchievementApi
);

router.post(
  '/',
  validateRequest(createAchievementSchema),
  controller.createAchievementApi
);

router.get('/:id', controller.getAchievementByIdApi);

router.put(
  '/:id',
  validateRequest(updateAchievementSchema),
  controller.updateAchievementApi
);

export default router;
