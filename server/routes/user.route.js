import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";
import {
  userList,
  updateProfile,
  sendFriendRequest,
  handleFriendRequest,
  getFriendRequests,
  getMutualFriends,
  getProfile,
  getFriendList,
  removeFriend
} from "../controllers/user.controller.js";
const router = express.Router();
router.get("/getProfile", verifyAuth, getProfile);
router.get("/user-list", verifyAuth, userList);
router.put("/update-profile", verifyAuth, updateProfile);
router.post("/send-request", verifyAuth, sendFriendRequest);
router.post("/action-request", verifyAuth, handleFriendRequest);
router.get("/friend-request-list", verifyAuth, getFriendRequests);
router.get("/getMutualFriendS", verifyAuth, getMutualFriends);
router.get("/friends-list",verifyAuth,getFriendList)
router.post("/remove-friend",verifyAuth,removeFriend)
export default router;
