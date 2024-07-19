// login.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('otp') && this.otp) {
    this.otp = await bcrypt.hash(this.otp.toString(), 10);
  }
  next();
});

UserSchema.methods.compareOTP = async function(candidateOTP) {
  if (this.otp && candidateOTP) {
    return bcrypt.compare(candidateOTP.toString(), this.otp);
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema);