import { Router } from 'express';
import { findAchievementApproval } from '../controller/achievement/achievement-approval-get';
import { updateAchievementApproval } from '../controller/achievement/achievement-approval-put';

const router = Router();
router.get('/', findAchievementApproval);
router.put('/:id', updateAchievementApproval);

export default router;
