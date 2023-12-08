const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const UnAuthenticated = require("../errors/unauthenticated");
const BadRequest = require("../errors/bad-request");
const User = require("../models/user");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequest("please provide all fields");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequest("please provide all fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnAuthenticated("wrong email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnAuthenticated("wrong email or password");
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY , {
      expiresIn : process.env.JWT_LIFETIME
    });

    res.json({ message: "user logged in successfully", token });
  } catch (error) {
    next(error);
  }
};

const protected = (req , res) => {
  res.json({message : "protected"})
}

module.exports = {
    signup , 
    login,
    protected
}