const AttendanceModel = require('../models/attendanceModel');
const MemberModel = require('../models/memberModel');
const EventModel = require('../models/eventModel');
const { param, body, validationResult } = require('express-validator');
const moment = require('moment');

exports.validateInsertAttendance = () => {
    return [
        body('eventId').exists().custom(value => {
           
            return EventModel
                .findOne({ _id: value })
                .exec()
                .then(event => {
                    if(!event) {
                        return Promise.reject('Event does not exist.');
                    }              
                })
        }),
        body('memberId').exists().custom(value => {
            return MemberModel
                .findOne({ _id: value })
                .exec()
                .then(member => {
                    if(!member) {
                        return Promise.reject('Member does not exist.');
                    }              
                })
        }),
        body('timeIn').exists().custom((value, {req}) => {
            let datePart = moment().startOf('day');
            let timeIn = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));

            if(!timeIn.isValid()) {
                return Promise.reject('Invalid time format. Please use HH:mm or hh:mm A');
            } else if(req.body.timeOut) {
                let timeOut = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${req.body.timeOut}`));                
                if(timeIn.isSameOrAfter(timeOut)) {
                    return Promise.reject('timeIn must be earlier than timeOut.'); 
                }
            }

            return value;
        }),
        body('timeIn').exists().customSanitizer( value => {
            let datePart = moment().startOf('day');
            let timeIn = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));        

            return timeIn.format("hh:mm A");
        }),
        body('timeOut').exists().custom((value, {req}) => {
            let datePart = moment().startOf('day');
            let timeOut = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));

            if(!timeOut.isValid()) {
                return Promise.reject('Invalid time format. Please use HH:mm or hh:mm A');
            }  else if(req.body.timeIn) {
                let timeIn = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${req.body.timeIn}`));                
                if(timeIn.isSameOrAfter(timeOut)) {
                    return Promise.reject('timeOut must be later than timeIn.'); 
                }
            }

            return value;
        }),
        body('timeOut').exists().customSanitizer(value => {
            let datePart = moment().startOf('day');
            let timeOut = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));     

            return timeOut.format("hh:mm A");
        })
    ]
}

exports.validateUpdateAttendance  = () => {
    return[
        body('eventId').optional().custom(value => {
            return EventModel
                .findOne({ _id: value })
                .exec()
                .then(event => {
                    if(!event) {
                        return Promise.reject('Event does not exist.');
                    }              
                })
        }),
        body('memberId').optional().custom(value => {
            return MemberModel
                .findOne({ _id: value })
                .exec()
                .then(member => {
                    if(!member) {
                        return Promise.reject('Member does not exist.');
                    }              
                })
        }),
        body('timeIn').optional().custom((value, {req}) => {
            let datePart = moment().startOf('day');
            let timeIn = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));

            if(!timeIn.isValid()) {
                return Promise.reject('Invalid time format. Please use HH:mm or hh:mm A');
            } else if(req.body.timeOut) {
                let timeOut = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${req.body.timeOut}`));                
                if(timeIn.isSameOrAfter(timeOut)) {
                    return Promise.reject('timeIn must be earlier than timeOut.'); 
                }
            } else { //compare with db
                return AttendanceModel
                        .findOne({_id: req.params.attendanceId})
                        .exec()
                        .then(attendance =>{
                            if(attendance) {
                                let timeOut = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${attendance.timeOut}`)); 
                            
                                if(timeIn.isSameOrAfter(timeOut)) {
                                    return Promise.reject('timeIn must be earlier than existing timeOut.');
                                }
                            }
                        })
            }

            return value;
        }),
        body('timeIn').optional().customSanitizer( value => {
            let datePart = moment().startOf('day');
            let timeIn = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));        

            return timeIn.format("hh:mm A");
        }),
        body('timeOut').optional().custom((value, {req}) => {
            let datePart = moment().startOf('day');
            let timeOut = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));

            if(!timeOut.isValid()) {
                return Promise.reject('Invalid time format. Please use HH:mm or hh:mm A');
            }  else if(req.body.timeIn) {
                let timeIn = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${req.body.timeIn}`));                
                if(timeIn.isSameOrAfter(timeOut)) {
                    return Promise.reject('timeOut must be later than timeIn.'); 
                }
            } else { //compare with db
                return AttendanceModel
                        .findOne({_id: req.params.attendanceId})
                        .exec()
                        .then(attendance =>{
                            if(attendance) {
                                let timeIn = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${attendance.timeIn}`)); 
                            
                                if(timeIn.isSameOrAfter(timeOut)) {
                                    return Promise.reject('timeOut must be later than existing timeIn.');
                                }
                            }
                        })
            }

            return value;
        }),
        body('timeOut').optional().customSanitizer(value => {
            let datePart = moment().startOf('day');
            let timeOut = moment(new Date(`${datePart.format('YYYY-MM-DD')} ${value}`));     

            return timeOut.format("hh:mm A");
        })
    ]
}