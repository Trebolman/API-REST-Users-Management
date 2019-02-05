const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SendSchema = new Schema(
    {
        send_name:String,
        send_lastname:String,
        send_company:String,
        send_country:String,
        send_city:String,
        send_street:String,
        send_state:String,
        send_phone:String,
        send_zip:String
    }
);

module.exports = mongoose.model('Send', SendSchema);