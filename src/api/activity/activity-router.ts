import { Router } from 'express';

import * as controller from '@api/activity/activity-controller';
import {
  findActivityQuerySchema,
  createActivitySchema,
  updateActivitySchema,
} from '@api/activity/activity-schema';
import {
  validateRequest,
  validateQuery,
} from '@api/middleware/validate-request';

const router = Router();

router.get(
  '/',
  validateQuery(findActivityQuerySchema),
  controller.findActivityApi
);
router.post(
  '/',
  validateRequest(createActivitySchema),
  controller.createActivityApi
);
router.get('/:id', controller.getActivityByIdApi);
router.put(
  '/:id',
  validateRequest(updateActivitySchema),
  controller.updateActivityApi
);

export default router;
