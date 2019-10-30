/*
1- find
2- write
3- category
4- write_comment
5- confirm_slug

*/
const CssModel        = require("../models/css")
const JavascriptModel = require("../models/javascript")
const PythonModel     = require("../models/python")
const NodejsModel     = require("../models/nodejs")
const ReactjsModel    = require("../models/reactjs")
const OtherModel      = require("../models/other")
const RecentModel     = require("../models/recent")
const UserModel       = require("../models/user")



class Post{
    constructor() {
    }
    async wirte(tech,fullNewPost,overView,userPost,userId){
      await  new tech(fullNewPost).save()
      await  new RecentModel(overView).save() 
      await UserModel.findOneAndUpdate({ _id: userId },{ $push: { posts: userPost } }).then(()=>{
       return true
     }).catch(err=> console.log(err))
    }
    async find(tech,slug){
      let result = false;
      await  tech.findOne({slug}).then(found=>{
           result = (found)?found:false
        }).catch(err=> console.log(err))
        return result

    }
    async write_comment(tech,slug,comment){
      await  tech.findOneAndUpdate({slug},{ $push: { comment } }).then(()=>{
            return true
        }).catch(err=> console.log(err))
    }
    async category(category){
        let result = false
      await  category.find({}).sort({_id:-1}) .then(found=>{
            result = (found)?found:false
        }).catch(err=> console.log(err))
        return result

    }
    async confirm_slug(slug){
        let result = false
      await RecentModel.findOne({slug}).then((found)=>{
            result = (found)?true:false
            
        }).catch(err=>{
            console.log(err)
        })
        return result
    }
}
module.exports = Post
