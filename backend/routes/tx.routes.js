const express = require('express');
const router = express.Router();
const multer = require('multer');
const txController = require('../controllers/tx.controller');

// Use memory storage for the uploaded image so we can stream it to Cloudinary or write to local
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), txController.addExpense);
router.get('/', txController.getExpenses);
router.put('/:id', txController.updateExpense);
router.delete('/:id', txController.deleteExpense);

// New Trash bin endpoints
router.get('/trash', txController.getTrashedExpenses);
router.post('/restore/:id', txController.restoreExpense);
router.delete('/purge/:id', txController.purgeExpense);
router.delete('/trash/clear', txController.clearTrash);
router.get('/analytics', txController.getAnalytics);

module.exports = router;
