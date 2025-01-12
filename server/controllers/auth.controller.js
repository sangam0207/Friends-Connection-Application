import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../configs/constant.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User Already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      data: {
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, userExist.password);
    if (!matchPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const payload = { id: userExist._id, email: userExist.email };
    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN || "1d",
    });
     const requestCount=userExist.friendRequests.length;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {name:userExist.name, email: userExist.email,totalRequest:requestCount },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const logout=async(req, res) =>{
  try {
    if (req.cookies["token"]) {
      res.clearCookie("token");
    }
    return "User logged out successfully";
  } catch (err) {
    throw new Error(err.message);
  }
}

export { signup, login,logout };
