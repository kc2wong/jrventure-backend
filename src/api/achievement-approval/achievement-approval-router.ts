import { Router } from 'express';

import * as controller from '@api/achievement-approval/achievement-approval-controller';
import {
  achievementApprovalReviewSchema,
  findAchievementApprovalQuerySchema,
  
} from '@api/achievement-approval/achievement-approval-schema';
import {
  validateRequest,
  validateQuery,
} from '@api/middleware/validate-request';

const router = Router();

router.get(
  '/',
  validateQuery(findAchievementApprovalQuerySchema),
  controller.findAchievementApprovalApi
);

router.get(
  '/:id',
  controller.getAchievementApprovalByIdApi
);

router.post(
  '/:id/review',
  validateRequest(achievementApprovalReviewSchema),
  controller.createAchievementApprovalReviewApi
);

router.post(
  '/:id/approval',
  controller.approveAchievementApprovalApi
);

router.post(
  '/:id/profanity-check',
  controller.profanityCheckAchievementApprovalApi
);

export default router;
