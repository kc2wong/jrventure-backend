import { Router } from 'express';
import { userGet } from '../controller/user/users-get';
import { createUser } from '../controller/user/users-post'
import { updateUser } from '../controller/user/users-put';

const router = Router();

router.get('/', userGet);
router.post('/', createUser);
router.put('/:id', updateUser);

export default router;
