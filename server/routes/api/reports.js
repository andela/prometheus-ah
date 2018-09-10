import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import ReportsController from '../../controllers/ReportsController';
import ReportValidation from '../../middlewares/validations/ReportValidation';
import QueryValidation from '../../middlewares/validations/QueryValidation';
import isAdmin from '../../middlewares/isAdmin';

const router = express.Router();

// Protect endpoints
router.use(Authenticate.auth);

// Report endpoints (Protected)
router.get(
  '/',
  isAdmin,
  QueryValidation.queryValidation,
  ReportsController.getReports
);
router.get(
  '/:reportId',
  isAdmin,
  ReportValidation.validateId,
  ReportsController.getReport
);
router.put(
  '/:reportId',
  isAdmin,
  ReportValidation.validateId,
  ReportsController.closeReport
);
router.delete(
  '/:reportId',
  isAdmin,
  ReportValidation.validateId,
  ReportsController.deleteReport
);

export default router;
