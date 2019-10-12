const express    = require("express")
const path       = require("path")
const fs         = require("fs")
const slugger    = require("slugify")
const router     = express.Router();
const Css        = require("../models/css")
const Python     = require("../models/python")
const Javascript = require("../models/javascript")
const Nodejs     = require("../models/nodejs")
const Reactjs    = require("../models/reactjs")
const Other      = require("../models/other")
const Recent     = require("../models/recent")
const User       = require("../models/user")
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
        wirtePost(Javascript)
    }else if(tech === "python"){
        wirtePost(Python)
    }else if(tech === "nodejs"){
        wirtePost(Nodejs)
    }else if(tech === "reactjs"){
        wirtePost(Reactjs)
    }else if(tech === "css"){
        wirtePost(Css)
        
    }else if(tech === "other"){
        wirtePost(Other)
        
    }else{
       
        res.render("error",{user: req.user,error: globalFunction.error404,nouser: false})
    }
    function wirtePost(tech){
        new tech(fullNewPost).save()
    }
   await new Recent(overview).save()  // adding in recent collection

   await User.findOneAndUpdate({ _id: req.user.id },{ $push: { posts: userPost } }).then(()=>{
       res.json({done: true})
   })

   
})

module.exports = router