// 登陆  注册
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const keys = require('../../config/keys')
const passport = require('passport')


const User = require('../../models/User')

// $route  GET api/users/test
// @desc  返回的请求的json数据
// @access public (公共接口)
router.get('/test', (req, res) => {
    res.json({ msg: 'login works' })
})

// $route  POST api/users/register
// @desc  注册接口
// @access public (公共接口)
// post请求必须安装第三方模块body-parser
router.post('/register', (req, res) => {
    // 查询数据库中是否已存在该邮箱
    User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                return res.status(400).json('邮箱已被注册')
            } else {
            	const avatar = gravatar.url(req.body.email, {
				        s: '200', // 大小
				        r: 'pg', // 格式
				        d: 'mm' // 默认给一个头像
				     })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })

                // 加密密码
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err

                        newUser.password = hash
                    	// 保存数据-->新增到数据库 表名
                        newUser.save()
                        	   .then(user => res.json(user))
                               .catch(err => console.log(err))
                    });
                });
            }
        })
})
// $route  POST api/users/login
// @desc  登陆接口
// @access public (公共接口)
router.post('/login', (req, res) => {
	const email = req.body.email
	const password = req.body.password
	User.findOne({ email }).then(user => {
		if(!user) {
			return res.status(404).json('用户不存在')
		}

		// 匹配密码
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// 生成token的规则
				const rule = {
					id: user.id,
					name: user.name,
					avatar: user.avatar,
					identity: user.identity
				}
				// 规则 key/secret 过期时间（3600s） 回调(过期的回调)
				jwt.sign(rule, keys.secretOrKey, {expiresIn: 10 }, (err, token) => {
					  if (err) throw err

			          res.json({
			            success: true,
			            // 这里必须是Bearer 后面有个空格
			            token: 'Bearer ' + token
			          })
		        })
				// res.json({msg: 'success'})
			} else {
				return res.status(400).json('密码错误')
			}
		})
	})
})
// $route  GET api/users/current
// @desc  return current user
// @access Private (私有接口--必须有token才行)
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
	// 验证成功返回内容
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email,
		identity: req.user.identity
	})
})


module.exports = router