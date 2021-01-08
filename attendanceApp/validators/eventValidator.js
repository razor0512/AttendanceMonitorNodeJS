const EventModel = require('../models/eventModel');
const { param, body, validationResult } = require('express-validator');
const moment = require('moment');

exports.validateAddEvent = () => {
    return [
        body('name').exists(),
        body('type').exists(),
        body('startDate').exists().custom(value => {
            let startDate = moment(new Date(value));            

            if(!startDate.isValid()) {
                return Promise.reject('Invalid date format.');
            }       

            return startDate;
        }),
        body('startDate').exists().customSanitizer(value => {
            return moment(new Date(value)).toISOString();
        }),
        body('endDate').exists().custom((value, {req}) => {
            let endDate = moment(new Date(value));            

            if(!endDate.isValid()) {
                return Promise.reject('Invalid date format.');
            } else {
                let startDate = moment(req.body.startDate);

                if(startDate.isAfter(endDate)) {
                    return Promise.reject('startDate must be earlier than endDate.');
                }
            }       
            return endDate;
        }),
        body('endDate').exists().customSanitizer(value => {
            return moment(new Date(value)).toISOString();
        })
    ]
}

exports.validateUpdateEvent = () => {
    return [
        body('startDate','Invalid date format.').optional().custom((value, {req}) => {
            let startDate = moment(new Date(value));             

            if(!startDate.isValid())
            {
                return Promise.reject('Invalid date format.');
            } else if(req.body.endDate) { //compare with body if specified
                let endDate = moment(req.body.endDate);

                if(startDate.isAfter(endDate)) {
                    return Promise.reject('startDate must be earlier than endDate.');
                }
            }
            else { //compare with db
                return EventModel
                        .findOne({ _id: req.params.eventId})
                        .exec()
                        .then(event => {
                            if(event)
                            {
                                let endDate = moment(event.endDate);

                                if(startDate.isAfter(endDate)) {
                                    return Promise.reject('startDate must be earlier than existing endDate.');
                                }
                            }
                        });
            }     

            return startDate;
        }),
        body('startDate').optional().customSanitizer(value => {
            return moment(new Date(value)).toISOString();
        }),
        body('endDate','Invalid date format.').optional().custom((value, {req}) => {
            let endDate = moment(new Date(value));             

            if(!endDate.isValid())
            {
                return Promise.reject('Invalid date format.');
            } else if(req.body.startDate) { //compare with body if specified
                let startDate = moment(req.body.startDate);

                if(startDate.isAfter(endDate)) {
                    return Promise.reject('endDate must be later than startDate.');
                }
            }
            else { //compare with db
                return EventModel
                        .findOne({ _id: req.params.eventId})
                        .exec()
                        .then(event => {
                            if(event)
                            {
                                let startDate = moment(event.startDate);

                                if(startDate.isAfter(endDate)) {
                                    return Promise.reject('endDate must be later than existing startDate.');
                                }
                            }
                        });
            }     

            return endDate;
        }),
        body('endDate').optional().customSanitizer(value => {
            return moment(new Date(value)).toISOString();
        })
    ]
}

exports.validateDeleteEvent = () => {
    return [
        param('eventId','Event has a member attendance.').custom(value => {
            console.log(value);

            return EventModel
                        .findOne({ _id: value })
                        .exec()
                        .then(event => {
                            if(event && event.membersAttendance.length > 0) {
                                return Promise.reject('Event has an event attendance.');
                            }
                        })
        })
    ]
}