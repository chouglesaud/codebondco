const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
	const token = req.params.token
	if (token) {
		jwt.verify(token, process.env.jwtSecret, (err, done) => {
			if (err) {
				let error = {
					name: 404,
					firstnum: 4,
					secondnum: 0,
					thirdnum: 4,
					firstword: 'webpage',
					secondword: 'not',
					thirdword: 'found'
				}
				return res.render('error', { user: req.user, error, nouser: false })
			}
			next()
		})
	}
}
