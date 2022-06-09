const mongoose = require("mongoose")


const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    staffNumber: {
        type: String,
        required: true,
    },
    rank: {
        type: String,
        required: true,
    },
    reportingTo: {
        type: String,
    
    },
    birthCertificate: {
        type: String,
        default: '',
    },
    bscHndCertificate: {
        type: String,
        default: '',
    },
    nyscCertificate: {
        type: String,
        default: '',
    },
    nimcIdentification: {
        type: String,
        default: '',
    },
     cv: {
        type: String,
        default: '',
    },
    others: {
        type: String,
        default: '',
    },
})
exports.Profile = mongoose.model('profile', profileSchema)
