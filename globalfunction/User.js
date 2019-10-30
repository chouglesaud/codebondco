const UserModel = require("../models/user");

class User {
  constructor() {}
  async find(username) {
    let result = false;
    await UserModel.findOne({ username: username }).then(found => {
      result = found ? found : false;
    });
    return result;
  }
}

class Update extends User{
    constructor() {
        super();
    }
    async preview(_id, updateObj){
        await UserModel.findByIdAndUpdate(
            { _id },
            { writing: updateObj.preview },
            { new: true }
          ).then(found => {
            return found.writing;
          });
    }
    async image_hosting(_id, updateObj){
        await UserModel.findByIdAndUpdate(
            { _id },
            { $push: { gallery: updateObj.gallery } }
          ).then((found) => {
            return found ? true : false;
          });

    }

    //if object is empty of undefined or null it will set as "username"
    // short-circuit evaluation

    async profile_detail(_id, updateObj){
        await UserModel.findByIdAndUpdate(
            { _id },
            { 
              instagram: updateObj.body.instagram || "username", 
              github: updateObj.body.github || "username",
              twitter: updateObj.body.twitter || "username",
              name: updateObj.body.name || "username",
              bio: updateObj.body.bio
            }
          ).then(found => {
            return found ? true : false;
          });

    }
    async profile_image(_id, updateObj){
        await UserModel.findByIdAndUpdate(
            { _id },
            { profilePic: updateObj.profilePic }
          ).then(() => {
            return true;
          });
    }
}


module.exports = {User,Update};
