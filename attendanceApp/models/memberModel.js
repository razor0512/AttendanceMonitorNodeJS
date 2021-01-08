const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({    
    eventsAttendance: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Attendance'
    }],
    name: {
        required: true,
        type: String
    },
    joinedDate: {
        type: String
    },
    status: {
        required: true,
        type: String
    }
});

const memberModel = mongoose.model('Member', memberSchema);

module.exports = memberModel;
