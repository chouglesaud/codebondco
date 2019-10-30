const express    = require("express")
const router     = express.Router();

const CssModel        = require("../models/css")
const JavascriptModel = require("../models/javascript")
const PythonModel     = require("../models/python")
const NodejsModel     = require("../models/nodejs")
const ReactjsModel    = require("../models/reactjs")
const OtherModel      = require("../models/other")


const globalFunction = require("../globalfunction/function")
const Postclass      = require("../globalfunction/Post")
const Post           = new Postclass

router.get("/:tech/:postname",(req,res)=>{
    localStorage.setItem('redirect', `/tutorial${req.url}`);
    let tech = req.params.tech
    let slug = req.params.postname;
  
   
    switch (tech) {
        case "javascript":
            find_supporter(JavascriptModel)
            break;
        case "python": 
            find_supporter(PythonModel)
            break;
        case "nodejs":
            find_supporter(NodejsModel)
            break;
        case "reactjs":
            find_supporter(ReactjsModel)
            break;
        case "css":
            find_supporter(CssModel)
             break;
        case "other":
            find_supporter(OtherModel)
            break;        
        default:
                res.render("error",{user: req.user,error: globalFunction.error400,nouser: false})
            break;
    }
    
    async function find_supporter(tech){  
   
        let foundPost = await Post.find(tech,slug)
        
            if(foundPost){
                res.render("post",{data: foundPost,user: req.user})
            }else{
                res.render("error",{user: req.user,error: globalFunction.error404,nouser: false})
            }
        
    }
   
})

module.exports = router
