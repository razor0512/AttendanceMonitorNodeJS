const express = require('express');
const router = express.Router();

const attendanceController = require('../controllers/attendanceController')
const attendanceValidator = require('../validators/attendanceValidator');

router.get('/', attendanceController.getAllAttendance)
router.post('/', attendanceValidator.validateInsertAttendance(), attendanceController.insertAttendance);
router.get('/:attendanceId', attendanceController.getAttendance);
router.put('/:attendanceId', attendanceValidator.validateUpdateAttendance(), attendanceController.updateAttendance);
router.delete('/:attendanceId', attendanceController.deleteAttendance);

module.exports = router;
