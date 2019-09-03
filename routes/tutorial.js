const express    = require("express")
const router     = express.Router();
const Css        = require("../models/css")
const Javascript = require("../models/javascript")
const Nodejs     = require("../models/nodejs")
const Reactjs    = require("../models/reactjs")
const Npm        = require("../models/npm")
const Other      = require("../models/other")

router.get("/:tech/:postname",(req,res)=>{
    localStorage.setItem('redirect', `/tutorial${req.url}`);
    let tech = req.params.tech
    let slug = req.params.postname;
  
    if(tech === "javascript"){
        findPost(Javascript)
    }else if(tech === "nodejs"){
        findPost(Nodejs)
    }else if(tech === "reactjs"){
        findPost(Reactjs)
    }else if(tech === "npm"){
        findPost(Npm)
    }else if(tech === "css"){
        findPost(Css)
        
    }else if(tech === "other"){
        findPost(Other)
        
    }else{
        let error = {
            name      : 404,
            firstnum  : 4,
            secondnum : 0,
            thirdnum  : 4,
            firstword : "webpage",
            secondword: "not",
            thirdword : "found"
        }
        res.render("error",{user: req.user,error,nouser: false})
    }
    
    function findPost(tech){    
        tech.findOne({slug: slug}).then(found=>{
            if(found){
                
                res.render("post",{data: found,user: req.user})
            }else{
                let error = {
                    name      : 404,
                    firstnum  : 4,
                    secondnum : 0,
                    thirdnum  : 4,
                    firstword : "webpage",
                    secondword: "not",
                    thirdword : "found"
                }
                res.render("error",{user: req.user,error,nouser: false})
            }
        })
    }
   
})

module.exports = router
