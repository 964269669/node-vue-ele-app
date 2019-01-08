const express  = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport');

const app = express()

// 引入users.js
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')

// DB config
const db = require('./config/keys').mongoURI
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
}
// 使用body-parser中间件
app.use(bodyParser.urlencoded({extend: false}))
app.use(bodyParser.json())


// 连接数据库
mongoose.connect(db, option)
		.then(() => console.log('连接数据库成功111'))
		.catch((err) => console.log(err))

// passport 初始化及配置
app.use(passport.initialize())
// 把上面定义的passport传入了 ./config/passport中 然后就可以在里面写代码了  代码抽离
require('./config/passport')(passport)

// app.get('/', (req,res) => {
// 	res.send('哼哼 你')
// })

// 使用 routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)

const port = process.env.PORT || 5007

app.listen(port, ()=>{
	console.log(`server is running on port ${port}`)
})