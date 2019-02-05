var mongoose = require('mongoose');

// definimos nuestros esquemas
var ProductSchema = new mongoose.Schema({
    prod_name: {
        type: String,
        lowercase: true,
        default: 'Xiaomi'
    },
    prod_image: String,
    prod_currency: String,
    prod_price: Number,
    prod_state: String,
    prod_amount: Number,
    prod_totalPay: Number
}, { _id: false });
module.exports = mongoose.model('Product', ProductSchema);