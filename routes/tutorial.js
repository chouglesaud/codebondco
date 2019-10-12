const express    = require("express")
const router     = express.Router();
const Css        = require("../models/css")
const Javascript = require("../models/javascript")
const Python     = require("../models/python")
const Nodejs     = require("../models/nodejs")
const Reactjs    = require("../models/reactjs")
const Other      = require("../models/other")
const globalFunction = require("../globalfunction/function")

router.get("/:tech/:postname",(req,res)=>{
    localStorage.setItem('redirect', `/tutorial${req.url}`);
    let tech = req.params.tech
    let slug = req.params.postname;
  
    if(tech === "javascript"){
        findPost(Javascript)
    }else if(tech === "python"){
        findPost(Python)
    }else if(tech === "nodejs"){
        findPost(Nodejs)
    }else if(tech === "reactjs"){
        findPost(Reactjs)
    }else if(tech === "css"){
        findPost(Css)
        
    }else if(tech === "other"){
        findPost(Other)
        
    }else{
       
        res.render("error",{user: req.user,error: globalFunction.error404,nouser: false})
    }
    
    function findPost(tech){    
        tech.findOne({slug: slug}).then(found=>{
            if(found){
                
                res.render("post",{data: found,user: req.user})
            }else{
                
                res.render("error",{user: req.user,error: globalFunction.error404,nouser: false})
            }
        })
    }
   
})

module.exports = router
