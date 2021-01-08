const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const eventValidator = require('../validators/eventValidator');

router.get('/export', eventController.exportToExcel);
router.get('/search', eventController.findEevents);
router.get('/', eventController.getAllEvents);
router.get('/:eventId', eventController.getEvent);
router.post('/', eventValidator.validateAddEvent(), eventController.insertEvent);
router.put('/:eventId', eventValidator.validateUpdateEvent(), eventController.updateEvent);
router.delete('/:eventId', eventValidator.validateDeleteEvent(), eventController.deleteEvent);


module.exports = router;
