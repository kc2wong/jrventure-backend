import { Router } from 'express';
import * as controller from '@api/activity-category/activity-category-controller';

const router = Router();

router.get('/', controller.listActivityCategoryApi);

export default router;
