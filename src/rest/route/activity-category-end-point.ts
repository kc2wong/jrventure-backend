import { Router } from 'express';
import { listActivityCategory } from '../controller/activity/activity-categoryt-get';

const router = Router();

router.get('/', listActivityCategory);

export default router;
