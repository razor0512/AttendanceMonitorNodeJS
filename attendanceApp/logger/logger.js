const fs = require("fs")
const moment = require('moment');

exports.log = req => {    
    let folderName = './logs'
    let fileName = `AttendanceMonitoringLogs-${moment().format('YYYY-MM-DD')}.txt`
    let path = `${folderName}/${fileName}`;  

    try{
        fs.exists(path, exists => {
            var data = `${moment().format('HH:mm:ss')}: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} \r\n`
            if(exists) {
                fs.appendFile(path, data, ()=>{});
            }
            else {
                fs.mkdir(folderName, () =>{
                    fs.writeFile(path, data, ()=>{});
                });                
            }
        }); 
    }
    catch(err){
        console.error(err);
    }
}