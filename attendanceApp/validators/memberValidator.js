const MemberModel = require('../models/memberModel');
const { param, body, validationResult } = require('express-validator');
const moment = require('moment');

exports.validateAddMember = () => {
    return [
        body('name').exists(),
        body('joinedDate','Invalid date format.').optional().custom(value => {
            let date = moment(new Date(value));            

            if(!date.isValid())
            {
                return Promise.reject('Invalid date format.');
            }       

            return date;
        }),
        body('joinedDate').optional().customSanitizer(value => {
            return moment(new Date(value)).toISOString();
        }),
        body('status','Invalid status. Possible values: Active, In-active').exists().isIn(['Active','In-active'])
    ]
}

exports.validateUpdateMember = () => {
    return [
        body('name').optional(),
        body('joinedDate','Invalid date format.').optional().custom(value => {
            let date = moment(new Date(value));            

            if(!date.isValid())
            {
                return Promise.reject('Invalid date format.');
            }            

            return date;
        }),
        body('joinedDate').optional().customSanitizer(value => {
            return moment(new Date(value)).toISOString();
        }),
        body('status','Invalid status. Possible values: Active, In-active').optional().isIn(['Active','In-active'])
    ]
}

exports.validateDeleteMember = () => {
    return [
        param('memberId','Member has an event attendance.').custom(value => {
            return MemberModel
                .findOne({ _id: value })
                .exec()
                .then(member => {
                    console.log(member);
                    if(member && member.eventsAttendance.length > 0)
                    {
                        return Promise.reject('Member has an event attendance.');
                    }              
                })
        })
    ]
}