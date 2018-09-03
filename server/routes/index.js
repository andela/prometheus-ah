import express from 'express';

import api from './api';
import article from './articles/articleRoute';

const router = express.Router();

router.use('/api', api);

router.use('/api/articles', article);

module.exports = router;
