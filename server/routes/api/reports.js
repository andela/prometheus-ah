import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import ReportsController from '../../controllers/ReportsController';
import ReportValidation from '../../middlewares/validations/ReportValidation';
import QueryValidation from '../../middlewares/validations/QueryValidation';
import isAdmin from '../../middlewares/isAdmin';

const router = express.Router();

// Protect endpoints
router.use(Authenticate.auth);

router.get(
  '/user/:articleId',
  QueryValidation.queryValidation,
  ReportsController.getUsersReports
);
// Report endpoints (Protected)
router.get(
  '/',
  isAdmin,
  QueryValidation.queryValidation,
  ReportsController.getReports
);
router.get(
  '/:id',
  isAdmin,
  ReportValidation.validateId,
  ReportsController.getReport
);
router.put(
  '/:id',
  isAdmin,
  ReportValidation.validateId,
  ReportsController.closeReport
);
router.delete(
  '/:id',
  isAdmin,
  ReportValidation.validateId,
  ReportsController.deleteReport
);

export default router;
