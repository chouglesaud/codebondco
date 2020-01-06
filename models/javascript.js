const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const javascriptSchema = new Schema({
         title     : String,
         subtitle  : String,
         slug      : String,
         name      : String,
         username  : String,
         url       : String,
         date      : String,
         profilePic: String,
         img       : Object,
         tech      : String,
         like      : Number,
         post      : [],
         comment   : []
})
javascriptSchema.index({slug: -1})

const javascript     = mongoose.model("javascript",javascriptSchema)
      module.exports = javascript