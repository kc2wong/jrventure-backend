import { Router } from 'express';
import { listActivityCategory } from '../controller/activity-category/activity-category-get';

const router = Router();

router.get('/', listActivityCategory);

export default router;
