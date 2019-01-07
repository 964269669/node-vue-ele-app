const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema  表定义模板
const UseSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String
	},
	identity: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
})
// 模型(row的构造器)
module.exports = User = mongoose.model('users', UseSchema)