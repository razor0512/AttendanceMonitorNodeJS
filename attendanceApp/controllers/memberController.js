const MemberModel = require('../models/memberModel');
const { validationResult } = require('express-validator');
const myEventEmitter = require('../event/eventEmitter');

exports.getAllMembers = async (req, res) => {
    myEventEmitter.emit('log', req);

    let members = await MemberModel
                          .find()
                          .populate({
                                path: 'eventsAttendance',
                                select: '-member',
                                populate: {
                                    path: 'event',
                                    select: 'name'
                                }})
                          .exec();
  
    res.send(members);
  };

exports.insertMember = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    let member = req.body;

    let memberModel = new MemberModel(member);

    memberModel.save().then((createdMember) => {
        res.status(201).send(createdMember);
    })
    .catch((error) => {
        res.status(500).send(error);
    })

};

exports.getMember = async(req, res) => {
    myEventEmitter.emit('log', req);

    let { memberId } = req.params;

    MemberModel
        .find({ _id: memberId})
        .populate({
            path: 'eventsAttendance',
            select: '-member',
            populate: {
                path: 'event',
                select: 'name'
            }})
        .exec()
        .then((member) => {
            res.send(member);
        })
        .catch((error) => {
            res.status(500).send(error);
        })   
}

exports.updateMember = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    
    let { memberId } = req.params;

    let dataToUpdate = req.body;  

    MemberModel
        .findOneAndUpdate({ _id: memberId }, { $set: dataToUpdate })
        .then((result) => {
            res.send(200)
        })
        .catch((error) => {
            res.status(500).send(error);
        });  
};

exports.deleteMember = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    let { memberId } = req.params;

    MemberModel
        .deleteOne({_id: memberId})
        .exec()
        .then((result) =>{
            res.send(200)
        })
        .catch((error) => {
            res.status(500).send(error);
        })
}

exports.findMembers = async(req, res) => {
    myEventEmitter.emit('log', req);

    let query = req.query;
    let filters = {};

    if(query.status)
    {
        filters.status = query.status;
    }

    if(query.name)
    {
        filters.name = query.name;
    }

    MemberModel
        .find(filters)
        .then((members) =>{
            res.status(200).send(members);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
}

