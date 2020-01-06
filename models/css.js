const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const cssSchema = new Schema({
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
      post      : [],
      comment   : []
})
cssSchema.index({slug: -1})

const css            = mongoose.model("css",cssSchema)
      module.exports = css