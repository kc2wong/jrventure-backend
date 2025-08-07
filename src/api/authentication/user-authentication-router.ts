import { Router } from 'express';

import * as controller from '@api/authentication/authentication-controller'

const router = Router();

router.post('/', controller.userAuthenticationApi);

export default router;
