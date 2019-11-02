const express    = require("express")
const slugger    = require("slugify")
const router     = express.Router();

const CssModel        = require("../models/css")
const JavascriptModel = require("../models/javascript")
const PythonModel     = require("../models/python")
const NodejsModel     = require("../models/nodejs")
const ReactjsModel    = require("../models/reactjs")
const OtherModel      = require("../models/other")


const globalFunction = require("../globalfunction/function")
const Postclass      = require("../globalfunction/Post")



router.post("/post",async(req,res)=>{
    const Post = new Postclass
    const tech = req.body.tech
    let   slug = slugger(req.body.title,{
        replacement: '-',
        remove     : /[{}%=`^*+~.()'"!:@]/g,
        lower      : true
    })
    let fullNewPost = {
           title   : req.body.title,
           subtitle: req.body.subtitle,
            slug,
             img       : req.body.img,
             name      : req.user.name,
             username  : req.user.username,
             profilePic: req.user.profilePic,
             url       : `/tutorial/${req.body.tech}/${slug}`,
             date      : req.body.date,
             tech      : req.body.tech,
             post      : req.body.content
    }

    
    let overview = {
        url       : `/tutorial/${req.body.tech}/${slug}`,
        name      : req.user.name,
        profilePic: req.user.profilePic,
        title     : req.body.title,
        subtitle  : req.body.subtitle,
        img       : req.body.img,
        date      : req.body.date,
        tech      : req.body.tech,
        username  : req.user.username,
       slug
   }
   let userPost = {
        url     : `/tutorial/${req.body.tech}/${slug}`,
        title   : req.body.title,
        img     : req.body.img,
        date    : req.body.date,
        tech    : req.body.tech,
        username: req.user.username,
       slug
   }

   switch (tech) {
    case "javascript": 
        res.json({done: Post.wirte(JavascriptModel,fullNewPost,overview,userPost,req.user.id)})
        break;
    case "python": 
        res.json({done: Post.write(PythonModel,fullNewPost,overview,userPost,req.user.id)})
        break;
    case "nodejs": 
        res.json({done: Post.write(NodejsModel,fullNewPost,overview,userPost,req.user.id)})
        break;
    case "reactjs": 
        res.json({done: Post.write(ReactjsModel,fullNewPost,overview,userPost,req.user.id)})
        break;
    case "css": 
        res.json({done: Post.write(CssModel,fullNewPost,overview,userPost,req.user.id)})
         break;
    case "other": 
        
        res.json({done: Post.write(OtherModel,fullNewPost,overview,userPost,req.user.id)})
        break;        
    default: 
        res.render("error",{user: req.user,error:globalFunction.error404,nouser: false})
        break;
}
   
})

module.exports = router