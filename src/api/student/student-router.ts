import { Router } from 'express';

import { validateQuery } from '@api/middleware/validate-request';
import * as controller from '@api/student/student-controller'
import { findStudentQuerySchema } from '@api/student/student-schema';

const router = Router();

router.get('/', validateQuery(findStudentQuerySchema), controller.findStudentApi);

export default router;
