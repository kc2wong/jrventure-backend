import { Router } from 'express';
import { findActivity } from '../controller/activity/activity-get';
import { getActivityById } from '../controller/activity/activity-get-by-id';
import { createActivity } from '../controller/activity/activity-post';
import { updateActivity } from '../controller/activity/activity-put';

const router = Router();

router.get('/', findActivity);
router.post('/', createActivity);
router.get('/:id', getActivityById);
router.put('/:id', updateActivity);

export default router;
