require('dotenv').config({path: './config/config.env'})
const express = require('express');
const dbConnect = require('./db/dbConnect');
const myEventEmitter = require('./event/eventEmitter');
const logger = require('./logger/logger');

const memberRouter = require('./routers/memberRouter');
const eventRouter = require('./routers/eventRouter');
const attendanceRouter = require('./routers/attendanceRouter');




const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/members', memberRouter);
app.use('/events', eventRouter);
app.use('/attendance', attendanceRouter);

myEventEmitter.on('log', req => {logger.log(req)});

app.listen(port,async () => {
    console.log("Connecting to MongoDB..");
  
    await dbConnect();
    
    console.log(`Server is running on port ${port}`);
  });

