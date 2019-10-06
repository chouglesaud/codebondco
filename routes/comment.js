const express    = require("express")
const path       = require("path")
const fs         = require("fs")
const router     = express.Router();
const Css        = require("../models/css")
const Javascript = require("../models/javascript")
const Python     = require("./models/python")
const Nodejs     = require("../models/nodejs")
const Reactjs    = require("../models/reactjs")
const Npm        = require("../models/npm")
const Other      = require("../models/other")
const Recent     = require("../models/recent")
const User       = require("../models/user")


router.post("/post",async(req,res)=>{
   
    let tech = req.body.tech
    let slug = req.body.slug
    let newSlug;

    if(slug[slug.length - 1] === "#"){           // it remove # if present in url 
        newSlug = slug.slice(0,slug.length-1)  //  else url as it is
    }else{                                     //
        newSlug = slug  //
    }                                        //

    let commentArray = []

   await req.body.comment.forEach((el,i)=>{
    commentArray[i] = el
    })

    let mycomment = {
        name        : req.user.name,
        username    : req.user.username,
        commentArray: commentArray,
        commentdate : req.body.date,
        profilePic  : req.user.profilePic
    }

    if(tech === "javascript"){
        writecomment(Javascript)
    }else if(tech === "python"){
        writecomment(Python)   
    }else if(tech === "nodejs"){
        writecomment(Nodejs)
    }else if(tech === "reactjs"){
        writecomment(Reactjs)
    }else if(tech === "npm"){
        writecomment(Npm)
    }else if(tech === "css"){
        writecomment(Css)
        
    }else{
        writecomment(Other)
    }
    function writecomment(category){
        category.findOneAndUpdate({slug: newSlug},{ $push: { comment:  mycomment } }).then(()=>{
            res.json({flag: true})
        })
    }
})

module.exports = router