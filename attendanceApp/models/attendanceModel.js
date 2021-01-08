const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({    
    event: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Event',
        required: true,
        alias: 'eventId'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Member',
        required: true,
        alias: 'memberId'
    },
    timeIn: {
        required: true,
        type: String        
    },
    timeOut: {
        type: String
    }
});

const attendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = attendanceModel;