const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const userSchema = new Schema({
  googleId  : String,
  name      : String,
  username  : String,
  email     : String,
  profilePic: String,
  verified  : Boolean,
  locale    : String,
  instagram : String,
  twitter   : String,
  github    : String,
  bio       : String,
  writing   : {},
  posts     : [],
  gallery   : [],

    })
userSchema.index({username: -1})
const User           = mongoose.model("user",userSchema)
      module.exports = User