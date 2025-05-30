import { Router } from 'express';
import { createAchievement } from '../controller/achievement/achievement-post';
import { updateAchievement } from '../controller/achievement/achievement-put';
import { findAchievement } from '../controller/achievement/achievement-get';

const router = Router();
router.get('/', findAchievement);
router.post('/', createAchievement);
router.put('/:id', updateAchievement);

export default router;
