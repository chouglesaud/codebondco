const express    = require("express")
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

router.get("/:tech/:postname",(req,res)=>{
    localStorage.setItem('redirect', `/tutorial${req.url}`);
    let tech = req.params.tech
    let slug = req.params.postname;
  
    if(tech === "javascript"){
        findPost(JavascriptModel)
    }else if(tech === "python"){
        findPost(PythonModel)
    }else if(tech === "nodejs"){
        findPost(NodejsModel)
    }else if(tech === "reactjs"){
        findPost(ReactjsModel)
    }else if(tech === "css"){
        findPost(CssModel)
        
    }else if(tech === "other"){
        findPost(OtherModel)
        
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
