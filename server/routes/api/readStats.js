import express from 'express';
import ReadingStatsController from '../../controllers/ReadingStatsController';
import OptionalAuthentication from '../../middlewares/validations/OptionalAuthentication';
import QueryValidation from '../../middlewares/validations/QueryValidation';

const router = express.Router();

router.get('/readstats', OptionalAuthentication.auth,
  QueryValidation.readStatsValidation,
  ReadingStatsController.getAllStats);

export default router;
