const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

const CssModel = require('../models/css')
const JavascriptModel = require('../models/javascript')
const NodejsModel = require('../models/nodejs')
const PythonModel = require('../models/python')
const VuejsModel = require('../models/vuejs')
const OtherModel = require('../models/other')
const RecentModel = require('../models/recent')
const UserModel = require('../models/user')
const AdminModel = require('../models/adminschema')

const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyToken = require('../services/verifytoken').default
const globalFunction = require('../globalfunction/function')

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: process.env.emailFrom,
		clientId: process.env.googleGmailId,
		clientSecret: process.env.googleGmailSecret,
		refreshToken: process.env.googleRefreshToken,
		accessToken: process.env.googleAccessToken
	}
})

const bcryptHashing = async data => {
	const salt = await bcrypt.genSalt(10)
	const hash = bcrypt.hash(data, salt)
	return hash
}
router.get('/login', async (req, res) => {
	//     new Admin({
	//      email: "codebond.co@gmail.com",
	//      password: await bcryptHashing("codebondisAwesome/@#?/")
	//    }).save((newadmin)=>{console.log("newadmin")}).then(()=>{res.render("adminlogin")}).catch((err)=>{console.log(err)})
	res.render('adminlogin')
})

router.post('/authentication', async (req, res) => {
	AdminModel.findOne({ email: req.body.email }).then(found => {
		if (found) {
			bcrypt.compare(req.body.password, found.password).then(async match => {
				if (match) {
					const token = jwt.sign(
						{ name: 'helloworld' },
						process.env.jwtSecret,
						{ expiresIn: '150000ms' }
					)
					const mailOption = {
						from: process.env.emailFrom,
						to: process.env.emailTo,
						subject: 'codebond token',
						generateTextFromHTML: true,
						html: `<div style="width: 100%; height: 200px; display: flex;justify-content: center; align-item: center;font-size: 14px;">
                    ${token}</div>`
					}

					transporter.sendMail(mailOption, (err, data) => {
						err ? console.log(err) : res.redirect('/')
					})
				} else {
					res.render('error', {
						user: req.user,
						error: globalFunction.error400,
						nouser: false
					})
				}
			})
		} else {
			res.render('error', {
				user: req.user,
				error: globalFunction.error400,
				nouser: false
			})
		}
	})
})

router.get('/:token/dashboard', verifyToken, async (req, res) => {
	console.log(req.params)
	res.render('admin', {
		js: await countDoc(JavascriptModel),
		py: await countDoc(PythonModel),
		node: await countDoc(NodejsModel),
		vue: await countDoc(VuejsModel),
		css: await countDoc(CssModel),
		other: await countDoc(OtherModel),
		total: await countDoc(RecentModel),
		user: await countDoc(UserModel)
	})
})

router.post('/removepost', (req, res) => {
	const tech = req.body.tech
	const slug = req.body.slug
	const title = req.body.title
	const postusername = req.body.postusername

	if (tech === 'javascript') {
		removePost(JavascriptModel)
	} else if (tech === 'python') {
		removePost(PythonModel)
	} else if (tech === 'nodejs') {
		removePost(NodejsModel)
	} else if (tech === 'vuejs') {
		removePost(VuejsModel)
	} else if (tech === 'css') {
		removePost(CssModel)
	} else if (tech === 'other') {
		removePost(OtherModel)
	} else {
		res.render('admin')
	}
	function removePost(tech) {
		tech.findOneAndDelete({ slug }).then(found => {
			RecentModel.findOneAndDelete({ slug }).then(async () => {
				UserModel.updateOne(
					{ username: postusername },
					{ $pull: { posts: { title: title } } }
				)
					.then(() => {
						res.json({ success: true })
					})
					.catch(err => {
						console.log(err)
					})
			})
		})
	}
})
router.post('/removeuser', (req, res) => {
	UserModel.findOneAndDelete({ username: req.body.username }).then(
		async () => {
			res.json({ success: true })
		}
	)
})

async function countDoc(arg) {
	let count = await arg.collection.countDocuments()

	return count
}

module.exports = router
