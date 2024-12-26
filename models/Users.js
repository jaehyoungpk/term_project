const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // 비밀번호 암호화를 위해 사용

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 비밀번호 저장 전에 해시 처리
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
