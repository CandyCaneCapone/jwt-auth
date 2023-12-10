const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true , "Please provide a password"],
    minLength: 6,
  },
});

userSchema.pre("save" , async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password , salt)
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password , this.password)
}
module.exports = mongoose.model("user", userSchema);
