const express = require('express')
const slugger = require('slugify')
const router = express.Router()

const CssModel = require('../models/css')
const JavascriptModel = require('../models/javascript')
const PythonModel = require('../models/python')
const NodejsModel = require('../models/nodejs')
const VuejsModel = require('../models/vuejs')
const OtherModel = require('../models/other')

const globalFunction = require('../globalfunction/function')
const Post = require('../globalfunction/Post')

router.post('/post', async (req, res) => {
	const tech = req.body.tech
	let url = undefined
	let slug = slugger(req.body.title, {
		replacement: '-',
		remove: /[{}%=`^*+~.()'"!:@]/g,
		lower: true
	})
	if (tech !== 'other') {
		url = `/tutorial/${tech}/${slug}`
	}
	if (tech === 'other') {
		url = `/${req.user.username}/${slug}`
	}

	let fullNewPost = {
		title: req.body.title,
		subtitle: req.body.subtitle,
		slug,
		img: req.body.img,
		name: req.user.name,
		username: req.user.username,
		profilePic: req.user.profilePic,
		url,
		date: req.body.date,
		tech: req.body.tech,
		post: req.body.content
	}

	let overview = {
		url,
		name: req.user.name,
		profilePic: req.user.profilePic,
		title: req.body.title,
		subtitle: req.body.subtitle,
		img: req.body.img,
		date: req.body.date,
		tech: req.body.tech,
		username: req.user.username,
		slug
	}
	let userPost = {
		url,
		title: req.body.title,
		img: req.body.img,
		date: req.body.date,
		tech: req.body.tech,
		username: req.user.username,
		slug
	}

	switch (tech) {
		case 'javascript':
			res.json({
				done: Post.write(
					JavascriptModel,
					fullNewPost,
					overview,
					userPost,
					req.user.id
				)
			})
			break
		case 'python':
			res.json({
				done: Post.write(
					PythonModel,
					fullNewPost,
					overview,
					userPost,
					req.user.id
				)
			})
			break
		case 'nodejs':
			res.json({
				done: Post.write(
					NodejsModel,
					fullNewPost,
					overview,
					userPost,
					req.user.id
				)
			})
			break
		case 'vuejs':
			res.json({
				done: Post.write(
					VuejsModel,
					fullNewPost,
					overview,
					userPost,
					req.user.id
				)
			})
			break
		case 'css':
			res.json({
				done: Post.write(
					CssModel,
					fullNewPost,
					overview,
					userPost,
					req.user.id
				)
			})
			break
		case 'other':
			res.json({
				done: Post.write(
					OtherModel,
					fullNewPost,
					overview,
					userPost,
					req.user.id
				)
			})
			break
		default:
			res.render('error', {
				user: req.user,
				error: globalFunction.error404,
				nouser: false
			})
			break
	}
})

module.exports = router
