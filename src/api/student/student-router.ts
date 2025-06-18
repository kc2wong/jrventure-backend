import { Router } from 'express';
import * as controller from '@api/student/student-controller'

const router = Router();

router.get('/', controller.findStudentApi);

export default router;
