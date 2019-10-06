const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const pythonSchema = new Schema({
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
      post      : [],
      comment   : []
})
pythonSchema.index({slug: -1})

const python            = mongoose.model("python",pythonSchema)
      module.exports = python