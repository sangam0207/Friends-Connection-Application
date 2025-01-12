import jwt, { decode } from "jsonwebtoken";
import { ENV } from "../configs/constant.js";

const verifyAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization || req.cookies["token"]) {
      let token;
      if (req.headers.authorization)
        token = req.headers.authorization.split(" ")[1];
      else token = req.cookies["token"];

      if (token) {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const userId = decoded.id;
        req.userId = userId;
        req.email = decode.email;
        next();
      } else {
        return res
          .status(401)
          .json({
            success: false,
            message: "You are not authorized to access this resource",
          });
      }
    } else {
      return res
        .status(401)
        .json({
          success: false,
          message: "You are not authorized to access this resource",
        });
    }
  } catch (error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "You are not authorized to access this resource",
      });
  }
};

export default verifyAuth;
