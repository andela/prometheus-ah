import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import NotificationsController from '../../controllers/NotificationsController';
import NotificationValidation from '../../middlewares/validations/notificationValidation';
import Users from '../../utils/utilities';
import QueryValidation from '../../middlewares/validations/QueryValidation';

const router = express.Router();

router.use(Authenticate.auth);
router.put(
  '/reads',
  NotificationValidation.validateNotificationBody,
  NotificationsController.updateNotification
);

router.get(
  '/users/:username',
  QueryValidation.queryValidation,
  Users.findUserByUsername,
  NotificationsController.getNotifications
);

router.put(
  '/status/:username',
  NotificationValidation.validateNotificationStatus,
  Users.findUserByUsername,
  NotificationsController.updateUserNotificationStatus
);

export default router;
