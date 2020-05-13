const express = require("express");
const router = express.Router();

const CssModel = require("../models/css");
const JavascriptModel = require("../models/javascript");
const PythonModel = require("../models/python");
const NodejsModel = require("../models/nodejs");
const VuejsModel = require("../models/vuejs");
const OtherModel = require("../models/other");

const globalFunction = require("../globalfunction/function");
const Post = require("../globalfunction/Post");

router.get("/:tech/:postname", (req, res) => {
    localStorage.setItem("redirect", `/tutorial${req.url}`);
    let tech = req.params.tech;
    let slug = req.params.postname;

    switch (tech) {
        case "javascript":
            find_supporter(JavascriptModel);
            break;
        case "python":
            find_supporter(PythonModel);
            break;
        case "nodejs":
            find_supporter(NodejsModel);
            break;
        case "vuejs":
            find_supporter(VuejsModel);
            break;
        case "css":
            find_supporter(CssModel);
            break;
        case "other":
            find_supporter(OtherModel);
            break;
        default:
            res.render("error", {
                user: req.user,
                error: globalFunction.error400,
                nouser: false,
            });
            break;
    }

    async function find_supporter(tech) {
        let foundPost = await Post.find(tech, slug);

        if (foundPost) {
            res.render("post", { data: foundPost, user: req.user });
        } else {
            res.render("error", {
                user: req.user,
                error: globalFunction.error404,
                nouser: false,
            });
        }
    }
});

module.exports = router;
