const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vuejsSchema = new Schema({
	title: String,
	subtitle: String,
	slug: String,
	name: String,
	url: String,
	username: String,
	date: String,
	profilePic: String,
	img: Object,
	tech: String,
	like: Number,
	post: [],
	comment: []
})
vuejsSchema.index({ slug: -1 })

const vuejs = mongoose.model('reactjs', vuejsSchema)
module.exports = vuejs
