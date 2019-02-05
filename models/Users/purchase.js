var mongoose = require('mongoose');

// definimos nuestros esquemas
var SendSchema = new mongoose.Schema({
    send_name: String,
    send_lastname: String,
    send_company: String,
    send_country: String,
    send_city: String,
    send_street: String,
    send_state: String,
    send_phone: String,
    send_zip: String
}, { _id: false });
// var Send = mongoose.model('Send', SendSchema);

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
ProductSchema.methods.totalPay = function(){
    return this.prod_amount * this.prod_price;
}
// var Product = mongoose.model('Product', ProductSchema);

var PurchaseSchema = new mongoose.Schema({
    purchase_date: Date,
    send_details: SendSchema,
    prod_details: [ProductSchema]
}, { _id: false });
PurchaseSchema.methods.fechaCompra = function () {
    console.log(this.purchase_date);
}
module.exports = mongoose.model('Purchase', PurchaseSchema);