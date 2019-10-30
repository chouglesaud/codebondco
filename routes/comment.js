const express         = require("express")
const path            = require("path")
const fs              = require("fs")
const router          = express.Router();

const CssModel        = require("../models/css")
const JavascriptModel = require("../models/javascript")
const PythonModel     = require("../models/python")
const NodejsModel     = require("../models/nodejs")
const ReactjsModel    = require("../models/reactjs")
const OtherModel      = require("../models/other")
const RecentModel     = require("../models/recent")
const UserModel       = require("../models/user")


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
        writecomment(JavascriptModel)
    }else if(tech === "python"){
        writecomment(PythonModel)   
    }else if(tech === "nodejs"){
        writecomment(NodejsModel)
    }else if(tech === "reactjs"){
        writecomment(ReactjsModel)
    }else if(tech === "css"){
        writecomment(CssModel)
        
    }else{
        writecomment(OtherModel)
    }
    function writecomment(category){
        category.findOneAndUpdate({slug: newSlug},{ $push: { comment:  mycomment } }).then(()=>{
            res.json({flag: true})
        })
    }
})

module.exports = router