const express = require('express');
const { EventEmitter } = require('events');
const router = express.Router();

const memberController = require('../controllers/memberController');
const memberValidator = require('../validators/memberValidator');


router.get('/search', memberController.findMembers)
router.get('/', memberController.getAllMembers);
router.get('/:memberId', memberController.getMember);
router.post('/', memberValidator.validateAddMember(), memberController.insertMember);
router.put('/:memberId', memberValidator.validateUpdateMember(), memberController.updateMember);
router.delete('/:memberId', memberValidator.validateDeleteMember(), memberController.deleteMember)


module.exports = router;
