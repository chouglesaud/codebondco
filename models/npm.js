const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const npmSchema = new Schema({
         title     : String,
         subtitle  : String,
         slug      : String,
         name      : String,
         url       : String,
         username  : String,
         date      : String,
         img       : String,
         profilePic: String,
         tech      : String,
         like      : Number,
         post      : [],
         comment   : []
})
npmSchema.index({slug: -1})

const npm            = mongoose.model("npm",npmSchema)
      module.exports = npm