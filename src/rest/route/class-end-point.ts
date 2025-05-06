import { Router } from 'express';
import { findClasses } from '../controller/class-controller';

const router = Router();

router.get('/', findClasses);

export default router;
