import { Router } from 'express';
import { findAchievementApproval } from '../controller/achievement/achievement-approval-get';
import { updateAchievementApproval } from '../controller/achievement/achievement-approval-put';
import { checkAchievementApprovalProfanity } from '../controller/achievement/achievement-approval-profanity-post';
import { getAchievementApprovalById } from '../controller/achievement/achievement-approval-get-by-id';

const router = Router();
router.get('/', findAchievementApproval);
router.get('/:id', getAchievementApprovalById);
router.put('/:id', updateAchievementApproval);
router.post('/:id/profanity-check', checkAchievementApprovalProfanity);

export default router;
