const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({    
    membersAttendance: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Attendance'
    }],
    name: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String
    },
    startDate: {
        required: true,
        type: Date
    },
    endDate: {
        required: true,
        type: Date
    }
});

const eventModel = mongoose.model('Event', eventSchema);

module.exports = eventModel;
