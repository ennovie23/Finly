const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

router.get('/ai', settingsController.getAiSettings);
router.post('/ai', settingsController.saveAiSettings);

module.exports = router;
