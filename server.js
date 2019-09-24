    require("dotenv").config()
    const fs           = require('fs')
    const express      = require("express")
    const bodyParser   = require("body-parser")
    const path         = require("path")
    const httpPORT     = 8000
    const httpsPORT    = 443
    const ejs           = require("ejs")
    const ejsLayout     = require("express-ejs-layouts")
    const mongoose      = require("mongoose")
    const cookieSession = require("cookie-session")
    const cookieParser  = require("cookie-parser")
    const passport      = require("passport")


    const fileParser = require("./globalfunction/function").fileParser
    const cloudinary = require("cloudinary")
    const app        = express()
    require("./services/cloudinary")
    const upload        = require("./services/multer")
    const auth          = require("./routes/auth")               // routes/auth.js
    const tutorial      = require("./routes/tutorial")           // routes/writeblog.js
    const api           = require("./routes/api")                // routes/api.js
    const passportSetup = require("./services/passport.config")  //  services/passportconfig.js
    const comment       = require("./routes/comment")
    const publish       = require("./routes/publish")
    const admin         = require("./routes/admin")

    const Css        = require("./models/css")
    const Javascript = require("./models/javascript")
    const Nodejs     = require("./models/nodejs")
    const Reactjs    = require("./models/reactjs")
    const Npm        = require("./models/npm")
    const Other      = require("./models/other")
    const Recent     = require("./models/recent")
    const User       = require("./models/user")


    
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
    }
   
    
    // Initialization
      app.listen(httpPORT,()=> console.log("server started ..."))

      
    // Middlewares
    app.use('/static', express.static(path.join(__dirname, 'public')))
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.set('view engine', 'ejs')



    mongoose.connect(process.env.mongodbUrl,{ useNewUrlParser: true ,useCreateIndex: true,useFindAndModify: false}).then(()=>{
        console.log('mongodb connected')
    }).catch((err)=>{
        console.log(err)
    })

    app.use(cookieSession({
        maxAge: 48*60*60*1000,
        keys  : [process.env.sessionKey]
    }))

    app.use(passport.initialize())
    app.use(passport.session())



    const checkUser = (req,res,next)=>{
        if(!req.user){
            localStorage.setItem('redirect', req.url);
            Recent.find({}).sort({_id:-1}).then(found=>{
                res.render("home",{Res: found,user: req.user})
            })
        }else{
            next()
        }
    }

 //   route Middlewares
    app.use("/tutorial",tutorial)
    app.use("/api",api)
    app.use("/auth",auth)
    app.use("/admin",admin)
    app.use("/comment",checkUser,comment)
    app.use("/publish",publish)

    //  routes
    // homepage
    app.get("/",checkUser,async(req,res)=>{
    
        Recent.find({}).sort({_id:-1}).then(found=>{
            res.render("home",{Res: found,user: req.user})
        })

    })
   
        // SEO 
        // robot.txt
        // sitemap.xml
        app.get("/.well-known/pki-validation/7466059DDBB0B1F91FD0479C0EED3B2A.txt",(req,res)=>{
            res.sendFile(path.join(__dirname+"/7466059DDBB0B1F91FD0479C0EED3B2A.txt"))
        })
        app.get("/robot.txt",(req,res)=>{                                                                              
            res.sendFile(path.join(__dirname,"/seo/robot.txt"))
        })
        app.get("/sitemap.xml",async(req,res)=>{
            const xml        = await require("./seo/sitemap")
               res.header('Content-Type', 'text/xml');
               res.send(xml)
        })
    

    app.get("/:username/setting",checkUser,(req,res)=>{
        res.render("setting",{user: req.user})
    })
    app.get("/:username/host",checkUser,(req,res)=>{

        res.render("host",{user: req.user,length:parseInt( req.user.gallery.length)})

    })

    app.post("/:username/upload",checkUser,upload.single("image"),async(req,res)=>{
        let result      = await cloudinary.v2.uploader.upload(req.file.path)
        let splitResult = result.secure_url.split("/")
        let newUrl      = `https://res.cloudinary.com/codebond/image/upload/w_700,q_auto:good,f_auto/${splitResult[6]}/${splitResult[7]}`
        
        User.findOneAndUpdate({_id: req.user.id},{$push: { gallery: newUrl } }).then(()=>{
            res.redirect(`/${req.user.username}/host`)
        })

    })

    app.post("/:username/updateprofile",checkUser,upload.single("profilepic"),async(req,res)=>{
    
        let result      = await cloudinary.v2.uploader.upload(req.file.path)
        let splitResult = result.secure_url.split("/")
  console.log(result) 
     let newProfilepic = `https://res.cloudinary.com/codebond/image/upload/w_120,h_120,c_thumb,g_face/${splitResult[6]}/${splitResult[7]}`
        User.findOneAndUpdate({_id: req.user.id},{profilePic:  newProfilepic}).then(()=>{
            res.redirect(`/${req.user.username}/setting`)
        })

    })

     // profile
     app.get("/:username",(req,res)=>{
        const username = req.params.username;
        User.findOne({username: username}).then((found)=>{
            if(found){
                res.render("profile",{user: req.user,
                    found: found})
            }else{
                res.render("error",{user: req.user,error: false,nouser: username})
            }
        })
    })

    app.post("/:username/update",checkUser,(req,res)=>{
        let instagram = setusername(req.body.instagram)
        let twitter   = setusername(req.body.twitter)
        let github    = setusername(req.body.github)
        

        function setusername(platform){
            if(platform === ""){
                platform = "username"
                return platform
            }
            return platform
        }
        

        User.findByIdAndUpdate({_id: req.user.id},{instagram,github,twitter,bio: req.body.bio}).then(found=>{
            res.redirect(`/${req.user.username}/setting`)
        }).catch(err=>{
            console.log(err)
        })
    })


    app.get("/:username/write",checkUser,(req,res)=>{
        localStorage.setItem('redirect', req.url);
        res.render("write",{user: req.user})
    })
    app.post("/post/reload",checkUser,(req,res)=>{
        User.findOne({username: req.user.username}).then((found)=>{
            res.json(found.writing)
        })
    })
    app.post("/post/preview",checkUser,async(req,res)=>{

       User.findOneAndUpdate({username: req.user.username},{writing: req.body},{new: true}).then((found)=>{
           res.json(found.writing)
       })
    })

    app.get("/:username/preview",checkUser,(req,res)=>{
        res.render("preview",{user: req.user,data: req.user.writing})
    })

 

   


    app.get("/tutorial/:tech",async(req,res)=>{
        localStorage.setItem('redirect', req.url)
        const tech = req.params.tech


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
        function findPost(category){
            category.find({}).sort({_id:-1}) .then(found=>{
                if(found){
                    res.render("category",{Res: found,tech ,user: req.user})
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



    app.post("/confirm",async(req,res)=>{
        let slug = req.body.slug
        
        
        Recent.findOne({slug: slug}).then((found)=>{
            if(found){
                res.json({confirmation: true})
            }else{
                res.json({confirmation: false})
            }
            
        }).catch(err=>{
            console.log(err)
        })
    })



    app.get("/codebond/terms",(req,res)=>{
        res.render("terms",{user: req.user})
    })

    app.get("/codebond/privacy-policy",(req,res)=>{
        res.render("policys",{user: req.user})
    })


    // 404
    app.use(function(req, res, next) {
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
    });
    
//    500 - Any server error
     app.use(function(err, req, res, next) {
         let error = {
             name      : 500,
             firstnum  : 5,
             secondnum : 0,
             thirdnum  : 0,
             firstword : "internal",
             secondword: "server",
             thirdword : "error"
         }
         res.render("error",{user: req.user,error,nouser: false})
     });


