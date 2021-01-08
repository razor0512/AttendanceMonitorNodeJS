const mongoose = require('mongoose');
const AttendanceModel = require('../models/attendanceModel');
const MemberModel = require('../models/memberModel'); 
const EventModel = require('../models/eventModel'); 
const { validationResult } = require('express-validator');
const myEventEmitter = require('../event/eventEmitter');

exports.getAllAttendance = async (req, res) => {
    myEventEmitter.emit('log', req);

    const attendance = await AttendanceModel
                          .find()
                          .populate({
                                path:  'event',
                                select: 'name type'
                            })
                          .populate({
                                path: 'member',
                                select: 'name status'})
                          .exec();
  
    res.send(attendance);
};

exports.getAttendance = async (req, res) => {   
    myEventEmitter.emit('log', req);

    let { attendanceId } = req.params;

    const attendance = await AttendanceModel
                          .find({ _id: attendanceId})
                          .populate({
                                path:  'event',
                                select: 'name type'
                            })
                          .populate({
                                path: 'member',
                                select: 'name status'})
                          .exec();
  
    res.send(attendance);
};

exports.insertAttendance = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    let attendance = req.body;

    let attendanceModel = new AttendanceModel(attendance);

    await attendanceModel.save().then(async (createdAttendance) => {
        let member = await MemberModel.findOneAndUpdate({_id : req.body.memberId}, {$push: {eventsAttendance: createdAttendance._id}})
        let event = await EventModel.findOneAndUpdate({_id : req.body.eventId}, {$push: {membersAttendance: createdAttendance._id}})
        res.status(200).send(createdAttendance);
    })
    .catch((error) => {
        res.sendStatus(500);
    })

};

exports.updateAttendance = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    let { attendanceId } = req.params;

    let body = req.body;

    let attendance = {};

    if(body.eventId)
    {
        attendance.event = body.eventId;
    }
    
    if(body.memberId)
    {
        attendance.member = body.memberId;
    }

    if(body.timeIn)
    {
        attendance.timeIn = body.timeIn;
    }

    if(body.timeOut)
    {
        attendance.timeOut = body.timeOut;
    }

    await AttendanceModel
            .findOne({ _id: attendanceId }, async (err, previousAttendance) => {     

                await AttendanceModel.findOneAndUpdate({ _id: attendanceId },  {$set: attendance});

                if(previousAttendance) {
                   //remove old reference
                   await MemberModel.findOneAndUpdate({ _id : previousAttendance.memberId }, {$pull: {eventsAttendance: previousAttendance._id}})
                   await EventModel.findOneAndUpdate({_id : previousAttendance.eventId}, {$pull: {membersAttendance: previousAttendance._id}})

                   //add new refernce
                   await MemberModel.findOneAndUpdate({_id : attendance.member}, {$push: {eventsAttendance: attendanceId}})
                   await EventModel.findOneAndUpdate({_id : attendance.event}, {$push: {membersAttendance: attendanceId}})
                }
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) => {
                res.sendStatus(500);
            })
};

exports.deleteAttendance = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    let { attendanceId } = req.params;

    await AttendanceModel
            .findOne({ _id: attendanceId }, async (err, attendance) => {     

                await AttendanceModel.findOneAndRemove({ _id: attendanceId });

                if(attendance) {
                    //remove old reference
                    await MemberModel.findOneAndUpdate({ _id : attendance.memberId }, {$pull: {eventsAttendance: attendance._id}})
                    await EventModel.findOneAndUpdate({_id : attendance.eventId}, {$pull: {membersAttendance: attendance._id}})
                }
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) => {
                res.sendStatus(500);
            })
}
