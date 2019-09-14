const express    = require("express")
const path       = require("path")
const fs         = require("fs")
const router     = express.Router();
const Css        = require("../models/css")
const Javascript = require("../models/javascript")
const Nodejs     = require("../models/nodejs")
const Reactjs    = require("../models/reactjs")
const Npm        = require("../models/npm")
const Other      = require("../models/other")
const Recent     = require("../models/recent")
const User       = require("../models/user")
const nodemailer = require("nodemailer")
const Admin      = require("../models/adminschema")
const bcrypt     = require("bcryptjs")
const jwt        = require("jsonwebtoken")
const verifyToken= require("../services/verifytoken")

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth   : {
        type        : 'OAuth2',
        user        : process.env.emailFrom,
        clientId    : process.env.googleGmailId,
        clientSecret: process.env.googleGmailSecret,
        refreshToken: process.env.googleRefreshToken,
        accessToken : process.env.googleAccessToken
    }
})


 

    
const bcryptHashing = async (data) =>{
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(data,salt)
    return  hash
}
router.get("/login",async(req,res)=>{
//     new Admin({
//      email: "codebond.cb@gmail.com",
//      password: await bcryptHashing("codebondisAwesome/@#?/")
//    }).save((newadmin)=>{console.log("newadmin")}).then(()=>{res.render("adminlogin")}).catch((err)=>{console.log(err)})
    res.render("adminlogin")
})

router.post("/authentication",async(req,res)=>{
    Admin.findOne({email: req.body.email}).then((found)=>{
        if(found){
            bcrypt.compare(req.body.password,found.password).then(async(match)=>{
                if(match){
                    const token = jwt.sign({name: "helloworld"},process.env.jwtSecret,{expiresIn: "150000ms"})
                const mailOption = {
                    from                : process.env.emailFrom,
                    to                  : process.env.emailTo,
                    subject             : "codebond token",
                    generateTextFromHTML: true,
                    html                : `<div style="width: 100%; height: 200px; display: flex;justify-content: center; align-item: center;background-color: #323538;color: #f5f4f5; font-size: 14px;">
                    ${token}</div>`
                };
                
                transporter.sendMail(mailOption,(err,data)=>{
                    (err) ? console.log(err): res.redirect("/")
                })
                }else{
                    let error = {
                        name      : 400,
                        firstnum  : 4,
                        secondnum : 0,
                        thirdnum  : 0,
                        firstword : "bad",
                        secondword: "request",
                        thirdword : "error"
                    }
                    res.render("error",{user: req.user,error,nouser: false})
                }
        
            })
        }else{
            let error = {
                name      : 400,
                firstnum  : 4,
                secondnum : 0,
                thirdnum  : 0,
                firstword : "bad",
                secondword: "request",
                thirdword : "error"
            }
            res.render("error",{user: req.user,error,nouser: false})
        }
    })
})

router.get("/:token/dashboard",verifyToken,async(req,res)=>{
   
    res.render("admin",{js: await countDoc(Javascript),node: await countDoc(Nodejs),react: await countDoc(Reactjs),npm: await countDoc(Npm),css: await countDoc(Css),other: await countDoc(Other),total: await countDoc(Recent),user: await countDoc(User)})
})

router.post("/removepost",(req,res)=>{
    
    const tech = req.body.tech
    const slug = req.body.title

    if(tech === "javascript"){
        removePost(Javascript)
    }else if(tech === "nodejs"){
        removePost(Nodejs)
    }else if(tech === "reactjs"){
        removePost(Reactjs)
    }else if(tech === "npm"){
        removePost(Npm)
    }else if(tech === "css"){
        removePost(Css)
        
    }else if(tech === "other"){
        removePost(Other)
        
    }else{
       
        res.render("admin")
    }
    function removePost(tech){
        tech.findOneAndDelete({slug}).then(found=>{
        
            Recent.findOneAndDelete({slug}).then(async()=>{
                res.json({success: true})
            })
        })
       
    }
    
})
router.post("/removeuser",(req,res)=>{
    User.findOneAndDelete({username: req.body.username}).then(async()=>{
        res.json({success: true})
    })
})

async function countDoc(arg){
    let count = await arg.collection.countDocuments();
   
    return count
}

module.exports = router

