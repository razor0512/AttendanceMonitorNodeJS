const EventModel = require('../models/eventModel');
const { validationResult } = require('express-validator');
const { query } = require('express');
const excel = require("exceljs");
const moment = require('moment');
const myEventEmitter = require('../event/eventEmitter');

exports.getAllEvents = async (req, res) => {
    myEventEmitter.emit('log', req);

    const events = await EventModel
                          .find()
                          .populate({
                              path: 'membersAttendance',
                              select: '-event',
                              populate: {
                                  path:'member',
                                  select:'name'
                              }
                          })
                          .exec();
  
    res.send(events);
};

exports.insertEvent = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    let event = req.body;

    let eventModel = new EventModel(event);

    eventModel.save().then((createdEvent) => {
        res.status(200).send(createdEvent);
    })
    .catch((error) => {
        res.sendStatus(500);
    })

};

exports.getEvent = async (req, res) => {
    myEventEmitter.emit('log', req);

    let { eventId } = req.params;

    const events = await EventModel
                          .find({_id: eventId})
                          .populate({
                              path: 'membersAttendance',
                              select: '-event',
                              populate: {
                                  path:'member',
                                  select:'name'
                              }
                          })
                          .exec();
  
    res.send(events);
};

exports.updateEvent = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    
    let { eventId } = req.params;
    let dataToUpdate = req.body;

    EventModel
        .updateOne({ _id: eventId }, { $set: dataToUpdate })
        .then((result) => {
            res.send(200)
        })
        .catch((error) => {
            res.status(500).send(error);
        });  
};

exports.deleteEvent = async(req, res) => {
    myEventEmitter.emit('log', req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    
    let { eventId } = req.params;

    EventModel
        .deleteOne({_id: eventId})
        .exec()
        .then((result) =>{
            res.send(200)
        })
        .catch((error) => {
            res.status(500).send(error);
        })
}

exports.findEevents = async(req, res) => {
    myEventEmitter.emit('log', req);

    let query = req.query;
    let filters = {};

    if(query.eventName)
    {
        filters.name = query.eventName;
    }

    if(query.dateStart)
    {
        filters.startDate = query.dateStart;
    }

    if(query.dateEnd)
    {
        filters.endDate = query.dateEnd;
    }

    EventModel
        .find(filters)
        .then((events) =>{
            res.status(200).send(events);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
};

exports.exportToExcel = async(req, res) => {
    myEventEmitter.emit('log', req);

    let { eventId } = req.query;     
                      
    await EventModel
            .findOne({_id: eventId})
            .populate({
                path: 'membersAttendance',
                select: '-event',
                sort: 'timeIn',
                populate: {
                    path:'member',
                    select:'name'
                }
            })
            .exec()
            .then(events => {
                let eventCollection = [];
                
                if(events) {
                    events.membersAttendance.forEach(value => {
                        let event = {
                            memberName : value.member.name,
                            timeIn: value.timeIn,
                            timeOut: value.timeOut
                        };
            
                        eventCollection.push(event);
                    })

                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet("Events");
    
                    worksheet.columns = [
                        { header: "MEMBERNAME", key: "memberName", width: 25 },
                        { header: "TIMEIN", key: "timeIn", width: 25 },
                        { header: "TIMEOUT", key: "timeOut", width: 25 },
                      ];
    
                    worksheet.addRows(eventCollection);                  
                 
                    let startDate = moment(new Date(events.startDate));
                    let fileName = `${events.name}-${startDate.format('DD_MM_YYYY_hh_mm')}`
          
                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                    res.setHeader(
                        "Content-Disposition",
                        `attachment; filename=${fileName}.xlsx`
                    );  
                    
                    return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                      });
                }
                else {
                    res.send(404);
                }          
            
            })
            .catch((error) => {
                res.status(500).send(error);
            }) 
}