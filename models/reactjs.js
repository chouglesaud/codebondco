const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const reactjsSchema = new Schema({
         title     : String,
         subtitle  : String,
         slug      : String,
         name      : String,
         url       : String,
         username  : String,
         date      : String,
         profilePic: String,
         img       : String,
         tech      : String,
         like      : Number,
         post      : [],
         comment   : []
})
reactjsSchema.index({slug: -1})

const reactjs        = mongoose.model("reactjs",reactjsSchema)
      module.exports = reactjs