import express from 'express';
import AdminController from '../../controllers/AdminController';
import Authenticate from '../../middlewares/Authenticate';
import isAdmin from '../../middlewares/isAdmin';
import superAdmin from '../../middlewares/superAdmin';
import QueryValidation from '../../middlewares/validations/QueryValidation';

const router = express.Router();

router.use(Authenticate.auth);

router.put('/:username/block', isAdmin, AdminController.blockUser);
router.put('/:username/unblock', isAdmin, AdminController.unBlockUser);
router.get('/blocked', isAdmin, QueryValidation.queryValidation, AdminController.getBlockedUsers);

// super admin route

router.put('/:username/create', superAdmin, AdminController.createAdmin);
router.put('/:username/remove', superAdmin, AdminController.removeAdmin);
export default router;
