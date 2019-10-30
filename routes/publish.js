const express    = require("express")
const path       = require("path")
const fs         = require("fs")
const slugger    = require("slugify")
const router     = express.Router();

const CssModel        = require("../models/css")
const JavascriptModel = require("../models/javascript")
const PythonModel     = require("../models/python")
const NodejsModel     = require("../models/nodejs")
const ReactjsModel    = require("../models/reactjs")
const OtherModel      = require("../models/other")
const RecentModel     = require("../models/recent")
const UserModel       = require("../models/user")

const globalFunction = require("../globalfunction/function")



router.post("/post",async(req,res)=>{
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


    if(tech === "javascript"){
        wirtePost(JavascriptModel)
    }else if(tech === "python"){
        wirtePost(PythonModel)
    }else if(tech === "nodejs"){
        wirtePost(NodejsModel)
    }else if(tech === "reactjs"){
        wirtePost(ReactjsModel)
    }else if(tech === "css"){
        wirtePost(CssModel)
        
    }else if(tech === "other"){
        wirtePost(OtherModel)
        
    }else{
       
        res.render("error",{user: req.user,error: globalFunction.error404,nouser: false})
    }
    function wirtePost(tech){
        new tech(fullNewPost).save()
    }
   await new RecentModel(overview).save()  // adding in recent collection

   await UserModel.findOneAndUpdate({ _id: req.user.id },{ $push: { posts: userPost } }).then(()=>{
       res.json({done: true})
   })

   
})

module.exports = router