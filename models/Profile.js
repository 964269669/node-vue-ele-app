const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  type: { // 收支类型
    type: String
  },
  describe: { // 收支描述
    type: String
  },
  income: { // 收入
    type: String,
    required: true
  },
  expend: { // 支出
    type: String,
    required: true
  },
  cash: { // 账户现金
    type: String,
    required: true
  },
  remark: { // 备注
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
