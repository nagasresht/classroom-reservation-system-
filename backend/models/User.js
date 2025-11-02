const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  staffNumber: { type: String, required: true },
  phone: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 digits'
    }
  },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
