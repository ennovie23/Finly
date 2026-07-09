const express = require('express');
const router = express.Router();
const multer = require('multer');
const scannerController = require('../controllers/scanner.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan', upload.single('image'), scannerController.scanImage);
router.post('/voice', express.json(), scannerController.parseVoiceLog);

module.exports = router;