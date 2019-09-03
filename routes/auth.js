const express   = require("express")
const path      = require("path")
const fs        = require("fs")
const router    = express.Router();
const passport  = require("passport")


// router.get("/login",(req,res)=>{
//     res.send("login")
// })

router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/")
})

router.get("/login",passport.authenticate("google",{
    scope: ['profile','email']
}))


router.get("/google/redirect",passport.authenticate("google"),async(req,res)=>{
    
    res.redirect(localStorage.getItem('redirect'))

    
})


module.exports = router