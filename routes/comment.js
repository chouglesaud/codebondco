const express = require('express')
const router = express.Router()

const CssModel = require('../models/css')
const JavascriptModel = require('../models/javascript')
const PythonModel = require('../models/python')
const NodejsModel = require('../models/nodejs')
const VuejsModel = require('../models/vuejs')
const OtherModel = require('../models/other')

const Post = require('../globalfunction/Post')

router.post('/post', async (req, res) => {
	let tech = req.body.tech
	let slug = req.body.slug
	let newSlug

	if (slug[slug.length - 1] === '#') {
		// it remove # if present in url
		newSlug = slug.slice(0, slug.length - 1) //  else url as it is
	} else {
		//
		newSlug = slug //
	} //

	let commentArray = []

	await req.body.comment.forEach((el, i) => {
		commentArray[i] = el
	})

	let mycomment = {
		name: req.user.name,
		username: req.user.username,
		commentArray: commentArray,
		commentdate: req.body.date,
		profilePic: req.user.profilePic
	}

	switch (tech) {
		case 'javascript':
			res.json({
				flag: Post.write_comment(JavascriptModel, newSlug, mycomment)
			})
			break
		case 'python':
			res.json({ flag: Post.write_comment(PythonModel, newSlug, mycomment) })
			break
		case 'nodejs':
			res.json({ flag: Post.write_comment(NodejsModel, newSlug, mycomment) })
			break
		case 'reactjs':
			res.json({ flag: Post.write_comment(VuejsModel, newSlug, mycomment) })
			break
		case 'css':
			res.json({ flag: Post.write_comment(CssModel, newSlug, mycomment) })
			break
		case 'other':
			res.json({ flag: Post.write_comment(OtherModel, newSlug, mycomment) })
			break
	}
})

module.exports = router
