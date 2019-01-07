const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // jwt_payload 如下内容
    //     {	
    //     	id: '5c318da7a2c1a41220689a94',
  		// 	name: '名字2',
  		// 	avatar: '//www.gravatar.com/avatar/5c2a3ccda593a46a98dee58f84880995?s=200&r=pg&d=mm',
  		// 	iat: 1546763748,
  		// 	exp: 1546767348
  		// }
  		// 通过id查找当前用户数据
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
}