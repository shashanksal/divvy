// Scripts to create mongo database, create collection and insert items to the collection

const fs = require('fs');
const mongoUrl = "mongodb://localhost:27017/";
const dbName = 'divvyDB2';
const mongoose = require("mongoose");
mongoose.connect(mongoUrl+dbName, { useNewUrlParser: true ,useUnifiedTopology: true});
const db = mongoose.connection;
const Trips =require('../models/Trips');

let raw_dataset = fs.readFileSync( '../public/dataset.json', 'utf8');
let divvy_dataset=JSON.parse(raw_dataset);



// function createDatabase(dbName) {
//     db.on("error",console.error.bind(console,"Connection error : "));
//     db.once("open",function () {
//         console.log("Connection successful and created Database : "+ dbName);
//     });
//
// }



function createTrips(dbName){
    db.on("error",console.error.bind(console,"Connection error : "));
    db.once("open",function () {
        console.log("Connection successful and created Database : "+ dbName);
        importjson(Trips);
    });
}


function importjson(Trips) {
    return new Promise((resolve, reject) => {
        function create_tripdata() {

            return new Promise((resolve, reject) => {
                let promises = [];
                for (let trip of divvy_dataset) {
                    let r = new Trips({
                        trip_id:trip.trip_id,
                        start_time:trip.start_time,
                        end_time:trip.end_time,
                        bikeid:trip.bikeid,
                        tripduration:parseFloat((trip.tripduration).replace(/,/g, '')),
                        from_station_id:trip.from_station_id,
                        from_station_name:trip.from_station_name,
                        to_station_id:trip.to_station_id,
                        to_station_name:trip.to_station_name,
                        gender:trip.gender,
                        birthyear:trip.birthyear
                    });
                    promises.push(r.save());
                }
                let data = Promise.all(promises);
                resolve(data);
            });
        }
        create_tripdata()
            .then(({ data}) => {
                console.log('\nTRIP - DATA:');
                resolve();
                db.close();
            });
    });
}


//createDatabase("divvyDB");
createTrips("divvyDB");
