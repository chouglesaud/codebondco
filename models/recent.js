const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const recentSchema = new Schema({
         title     : String,
         subtitle  : String,
         name      : String,
         username  : String,
         url       : String,
         date      : String,
         profilePic: String,
         img       : Object,
         tech      : String,
         slug      : String,
         like      : Number,
})
recentSchema.index({slug: -1})


const recent = mongoose.model("recent",recentSchema)
module.exports = recent