const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const otherSchema = new Schema({
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
otherSchema.index({slug: -1})

const other          = mongoose.model("other",otherSchema)
      module.exports = other