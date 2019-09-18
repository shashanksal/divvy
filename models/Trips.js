const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let tripSchema = new Schema({
    trip_id:{ type: String, unique: true },
    start_time:{ type: String },
    end_time:{type:String},
    bikeid:{type:Number},
    tripduration:{type:Number},
    from_station_id:{type:Number},
    from_station_name:{type:String},
    to_station_id:{type:Number},
    to_station_name:{type:String},
    gender:{type:String},
    birthyear:{type:Number , default:0}
});

// tripSchema.pre('save', (next) => { // arrow function
//     if (this.birthyear === null) {
//         this.birthyear = 0;
//     }
//
//     next();
// });

module.exports = mongoose.model('Trips', tripSchema);