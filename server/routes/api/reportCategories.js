import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import ReportCategoryController from '../../controllers/ReportCategoryController';
import ReportValidation from '../../middlewares/validations/ReportValidation';
import isAdmin from '../../middlewares/isAdmin';

const router = express.Router();

// Protect endpoints
router.use(Authenticate.auth);

// Report endpoints (Protected)
router.get(
  '/',
  ReportCategoryController.getReportCategories
);
router.get(
  '/:id',
  isAdmin,
  ReportValidation.validateId,
  ReportCategoryController.getReportCategory
);
router.put(
  '/:id',
  isAdmin,
  ReportValidation.validateId,
  ReportValidation.validateReportCategory,
  ReportCategoryController.updateReportCategory
);
router.delete(
  '/:id',
  isAdmin,
  ReportValidation.validateId,
  ReportCategoryController.deleteReportCategory
);

router.post(
  '/',
  isAdmin,
  ReportValidation.validateReportCategory,
  ReportCategoryController.createReportCategory
);

export default router;
