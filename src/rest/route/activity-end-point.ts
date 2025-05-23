import { Router } from 'express';
import { findActivity } from '../controller/activity/activity-get';
import { getActivityById } from '../controller/activity/activity-get-by-id';

const router = Router();

router.get('/', findActivity);
router.get('/:id', getActivityById);

export default router;
