const passport       = require("passport")
const googleStrategy = require("passport-google-oauth20")
const User           = require("../models/user")


passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use(
    new googleStrategy(
        {
            // options for google strategy
         callbackURL : "/auth/google/redirect",
         clientID    : process.env.googleId,
         clientSecret: process.env.googleSecret
        },
        (req,accessToken,refreshToken,profile,done)=>{
            // passport callback
            const data = profile._json

           

            User.findOne({googleId: data.sub}).then((currentUser)=>{
                if(currentUser){
                    // user already logged in
                    done(null,currentUser)
                }else{
                    // create new user
                    let   Split    = data.email.split("@")
                    const username = Split[0]
                   
                    new User({
                        googleId  : data.sub,
                        name      : data.name,
                        email     : data.email,
                        profilePic: data.picture,
                        verfied   : data.email_verified,
                        locale    : data.locale,
                        username  : `@${username}`,
                        instagram : "username",
                        github    : "username",
                        twitter   : "username"
              
                          }).save().then((newuser)=>{
                             done(null,newuser)
                             
                          })
                }
            })
           
          
        }
    )
)