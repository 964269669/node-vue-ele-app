<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">米修在线后台管理系统</span>
        <el-form
          :model="loginUser"
          :rules="rules"
          ref="loginForm"
          label-width="60px"
          class="loginForm"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" placeholder="请输入邮箱" v-model="loginUser.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="loginUser.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">登陆</el-button>
          </el-form-item>
          <div class="tiparea">
              <p>还没有账号? 现在注册<router-link to='/register'>注册</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'login',
  components: {},
  data() {
      return {
          loginUser: {
              email: '',
              password: ''
          },
          rules: {
              email: [
                  {
                      type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blue'
                  }
              ],
              password: [
                  {
                      required: true, message: '密码不能为空', trigger: 'blur'
                  },
                  {
                      min: 6, max: 30, message: '长度要在6-30之间', trigger: 'blur'
                  }
              ]
          }
      }
  },
  methods: {
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('api/users/login', this.loginUser)
            .then(res => {
                console.log('log success', res)
                // 登陆成功拿到token
                const { token } = res.data
                // 存储token都localStorage
                localStorage.setItem('eleToken', token)
                // 解析token  解析出来是对象 包含用户信息及token的过期时间
                const decoded = jwt_decode(token)
                console.log('解析token', decoded)
                // token 存储到vuex中
                this.$store.dispatch('setAuthenticated', !this.isEmpty(decoded))
                this.$store.dispatch('setUser', decoded)

                this.$router.push('/index')
            })
            .catch(err => {
                console.log(err)
            })
          }
        })
      },
      isEmpty(value) {
          return (
              value === undefined || value === null ||
              (typeof value === 'object' && Object.keys(value).length === 0) ||
              (typeof value === 'string' && value.trim().length === 0)
          )
      }
  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
</style>


