var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

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
        lowercase: true
    },
    prod_image: String,
    prod_currency: String,
    prod_price: Number,
    prod_state: String,
    prod_amount: Number,
    prod_totalPay: Number
}, { _id: true });
// var Product = mongoose.model('Product', ProductSchema);

var PurchaseSchema = new mongoose.Schema({
    purchase_date: Date,
    send_details: SendSchema,
    prod_details: [ProductSchema]
}, { _id: true });
// var Purchase = mongoose.model('Purchase', PurchaseSchema);

var UserSchema = new mongoose.Schema({
    user_username: {
        type: String,
        required: true,
        unique: true,
        default: ''
    },
    user_name: {
        type: String,
        required: true,
        default: 'Ninguno'
    },
    user_lastname: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true,
        unique: true
    },
    user_role: {
        type: Number,
        required: true, 
        default: 3
    },
    user_status: {
        type: String,
        required: true,
        default: 'Activo'
    },
    purchases_list: [
        PurchaseSchema
    ],
    user_salt: String,
    user_hash: String,
}, { versionKey: 'nModif', collection: 'c_user', _id: true, timestamps: true });

UserSchema.methods.setPassword = function (password) {
    this.user_salt = crypto.randomBytes(16).toString('hex');
    this.user_hash = crypto.pbkdf2Sync(password, this.user_salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.user_salt, 1000, 64, 'sha512').toString('hex');
    return this.user_hash === hash;
};

UserSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        user_username: this.user_username,
        user_name: this.user_name,
        user_lastname: this.user_lastname,
        user_email: this.user_email,
        user_role: this.user_role,
        purchases_list: this.purchases_list,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
};

UserSchema.methods.BuscarPorUsername = function (username) {
    this.find({ user_username: username }, (err, user)=>{
        return user;
    });
}
module.exports = mongoose.model('User', UserSchema); //este es un modelo