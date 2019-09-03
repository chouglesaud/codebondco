const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const nodejsSchema = new Schema({
         title     : String,
         subtitle  : String,
         slug      : String,
         name      : String,
         username  : String,
         url       : String,
         date      : String,
         profilePic: String,
         img       : String,
         tech      : String,
         like      : Number,
         post      : [],
         comment   : []
})
nodejsSchema.index({slug: -1})

const nodejs = mongoose.model("nodejs",nodejsSchema)
module.exports = nodejs