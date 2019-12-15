require("dotenv").config();
require("./services/cloudinary");

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const httpPORT = 8000;
const ejs = require("ejs");
const ejsLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const globalFunction = require("./globalfunction/function");
const cloudinary = require("cloudinary");
const app = express();
const upload = require("./services/multer");
const auth = require("./routes/auth"); // routes/auth.js
const tutorial = require("./routes/tutorial"); // routes/writeblog.js
const passportSetup = require("./services/passport.config"); //  services/passportconfig.js
const comment = require("./routes/comment");
const publish = require("./routes/publish");
const admin = require("./routes/admin");

const CssModel = require("./models/css");
const JavascriptModel = require("./models/javascript");
const PythonModel = require("./models/python");
const NodejsModel = require("./models/nodejs");
const ReactjsModel = require("./models/reactjs");
const OtherModel = require("./models/other");
const RecentModel = require("./models/recent");
const UserModel = require("./models/user");

const Postclass = require("./globalfunction/Post");
const Userclass = require("./globalfunction/User").User;
const Updateclass = require("./globalfunction/User").Update;
const User   = new Userclass
const Update = new Updateclass
const Post   = new Postclass


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

// Initialization
app.listen(httpPORT, () => console.log("server started ..."));

// Middlewares
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

mongoose
  .connect(process.env.mongodbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(err => {
    console.log(err);
  });

/* setting up cookie */
app.use(
  cookieSession({
    maxAge: 168 * 60 * 60 * 1000,
    keys: [process.env.sessionKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

const checkUser = (req, res, next) => {
  if (!req.user) {
    localStorage.setItem("redirect", req.url);
    RecentModel.find({})
      .sort({ _id: -1 })
      .then(found => {
        res.render("home", { Res: found, user: req.user });
      });
  } else {
    next();
  }
};

//   route Middlewares
app.use("/tutorial", tutorial);
app.use("/auth", auth);
app.use("/admin", admin);
app.use("/comment", checkUser, comment);
app.use("/publish", publish);

//  routes
// homepage
app.get("/", checkUser, async (req, res) => {
  RecentModel.find({})
    .sort({ _id: -1 })
    .then(found => {
      res.render("home", { Res: found, user: req.user });
    });
});

// SEO
// robot.txt
// sitemap.xml
// ads.txt
app.get("/tutorial/npm/npm-bcryptjs", (req, res) => {
  res.redirect("/tutorial/nodejs/npm-bcryptjs");
});
app.get("/ads.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "/seo/ads.txt"));
});

app.get("/robot.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "/seo/robot.txt"));
});
app.get("/sitemap.xml", async (req, res) => {
  RecentModel.find({}).then(async found => {
    let xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    await found.reverse().forEach(data => {
      xml += `
                      <url>\n
                          <loc>https://codebond.co${data.url}</loc>\n
                          <priority>0.6</priority>\n
                      </url>\n
                      `;
    });
    xml += `
                  <url>\n
                       <loc>https://codebond.co/</loc>\n
                       <priority>0.5</priority>\n
                  </url>\n
                  <url>\n
                  <loc>https://codebond.co/tutorial/javascript</loc>\n
                  <priority>0.3</priority>\n
                  </url>\n  
                  <url>\n
                  <loc>https://codebond.co/tutorial/python</loc>\n
                  <priority>0.3</priority>\n
                  </url>\n
                  <url>\n
                  <loc>https://codebond.co/tutorial/nodejs</loc>\n
                  <priority>0.3</priority>\n
                  </url>\n  
                  <url>\n
                  <loc>https://codebond.co/tutorial/reactjs</loc>\n
                  <priority>0.3</priority>\n
                  </url>\n   
                  <url>\n
                  <loc>https://codebond.co/tutorial/css</loc>\n
                  <priority>0.3</priority>\n
                  </url>\n  
                  <url>\n
                  <loc>https://codebond.co/tutorial/other</loc>\n
                  <priority>0.3</priority>\n
                  </url>\n  
                  </urlset>
                 `;
    res.header("Content-Type", "text/xml");
    res.send(xml);
  });
});

// profile
app.get("/:username", async(req, res) => {
    const username = req.params.username;
    let foundUser = await User.find(username);
    if (foundUser) {
      res.render("profile", { user: req.user, found: foundUser });
    } else {
      res.render("error", { user: req.user, error: false, nouser: username });
    }
});

app.get("/:username/setting", checkUser, (req, res) => {
  res.render("setting", { user: req.user });
});


// updloading image on cloudinary
app.post(
  "/image/upload",
  checkUser,
  async (req, res) => {
  
    
    let result = await cloudinary.v2.uploader.upload(req.body.file)
    let splitResult = result.secure_url.split("/");
    let newUrl = `https://res.cloudinary.com/saudchougle/image/upload/${
      splitResult[6]
    }/${splitResult[7]}`;
    let isHosted = Update.image_hosting(req.user.id, { gallery: newUrl });
    if (isHosted) {
      res.json({url: newUrl})
    }
  }
);

app.post(
  "/:username/updateprofile",
  checkUser,
  upload.single("profilepic"),
  async (req, res) => {
    let result = await cloudinary.v2.uploader.upload(req.file.path);
    let splitResult = result.secure_url.split("/");
    let newProfilepic = `https://res.cloudinary.com/codebond/image/upload/w_120,h_120,c_thumb,g_face/${
      splitResult[6]
    }/${splitResult[7]}`;
    let isUpdate = Update.profile_image(req.user.id, {
      profilePic: newProfilepic
    });
    if (isUpdate) {
      res.redirect(`/${req.user.username}/setting`);
    }
  }
);



app.post("/:username/update", checkUser, async(req, res) => {
    let isUpdate = Update.profile_detail(req.user.id, { body: await req.body });
    if (isUpdate) {
      res.redirect(`/${req.user.username}/setting`);
    } else {
      res.redirect(`/${req.user.username}/setting`);
    }
});

app.get("/:username/write", checkUser, (req, res) => {
  localStorage.setItem("redirect", req.url);
  res.render("write", { user: req.user });
});


app.post("/post/reload", checkUser, async(req, res) => {
    res.json((await User.find(req.user.username)).writing);

});
app.post("/post/preview", checkUser, async (req, res) => {
 res.json(await Post.preview(req.user.id, { preview: req.body }));
});



app.get("/tutorial/:tech", async (req, res) => {
  localStorage.setItem("redirect", req.url);
  const tech = req.params.tech;

  if (tech === "javascript") {
    category_supporter(JavascriptModel);
  } else if (tech === "nodejs") {
    category_supporter(NodejsModel);
  } else if (tech === "reactjs") {
    category_supporter(ReactjsModel);
  } else if (tech === "css") {
    category_supporter(CssModel);
  } else if (tech === "other") {
    category_supporter(OtherModel);
  } else if (tech === "python") {
    category_supporter(PythonModel);
  } else {
    res.render("error", {
      user: req.user,
      error: globalFunction.error404,
      nouser: false
    });
  }

  async function category_supporter(category) {
    res.render("category", {
      Res: await Post.category(category),
      tech,
      user: req.user
    });
  }
});

app.post("/confirm", async (req, res) => {
  res.json({ confirmation: await Post.confirm_slug(req.body.slug) });
});


// terms and policies
app.get("/codebond/terms", (req, res) => {
  res.render("terms", { user: req.user });
});

app.get("/codebond/privacy-policy", (req, res) => {
  res.render("policys", { user: req.user });
});

// 404
app.use(function(req, res, next) {
  res.render("error", {
    user: req.user,
    error: globalFunction.error404,
    nouser: false
  });
});

//    500 - Any server error
app.use(function(err, req, res, next) {
  res.render("error", {
    user: req.user,
    error: globalFunction.error404,
    nouser: false
  });
});
