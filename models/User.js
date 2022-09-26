const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  teacher:{
    type: Boolean,
  },
  student:{
    type: Boolean,
  },
  parent:{
    type: Boolean,
  },
});

module.exports = mongoose.model("user", UserSchema);
