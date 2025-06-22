import { Router } from 'express';
import * as controller from '@api/student/student-controller'
import { validateQuery } from '@api/middleware/validate-request';
import { findStudentQuerySchema } from '@api/student/student-schema';

const router = Router();

router.get('/', validateQuery(findStudentQuerySchema), controller.findStudentApi);

export default router;
