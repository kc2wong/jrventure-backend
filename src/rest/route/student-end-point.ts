import { Router } from 'express';
import { findStudent } from '../controller/student/find-student-controller';

const router = Router();

router.get('/', findStudent);

export default router;
