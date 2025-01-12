import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const getProfile = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const userList = async (req, res) => {
  try {
    // Ensure the logged-in user's ID is available
    const loggedInUserId = req.userId; // Extracted from auth middleware

    if (!loggedInUserId) {
      return res.status(400).json({
        success: false,
        message: "Logged-in user ID is required",
      });
    }

    // Fetch all users sorted by creation date
    const users = await User.find()
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    // Fetch the logged-in user's friends
    const loggedInUser = await User.findById(loggedInUserId).select("friends");

    // Map users to include the friendship status
    const updatedUsers = users.map((user) => ({
      ...user,
      isFriend: loggedInUser.friends.some(
        (friendId) => friendId.toString() === user._id.toString()
      ),
    }));

    res.status(200).json({
      success: true,
      message: "User List fetched successfully",
      data: updatedUsers,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { name, profilePic, interests, password } = req.body;
    const id = req.userId;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let updateFields = {};
    if (name) updateFields.name = name;
    if (profilePic) updateFields.profilePic = profilePic;

    // Handle interests update
    if (interests && Array.isArray(interests)) {
      updateFields.interests = [...existingUser.interests, ...interests];
    }

    // Handle password update (if needed)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Send Friend Request
const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.userId;

    if (!recipientId) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient ID is required" });
    }

    const recipient = await User.findById(recipientId);
    const sender = await User.findById(senderId);

    if (!recipient || !sender) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Check if the users are already friends
    if (recipient.friends.some((friend) => friend.toString() === senderId)) {
      return res
        .status(400)
        .json({ success: false, message: "You are already friends" });
    }
    const existingRequest = recipient.friendRequests.find(
      (req) => req.userId.toString() === senderId
    );
    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already sent" });
    }

    recipient.friendRequests.push({ userId: senderId });
    await recipient.save();

    try {
      req.io.to(recipientId).emit("friend-request-received", {
        senderId,
        senderName: sender.name,
        senderProfilePic: sender.profilePic,
        totalRequest:recipient.friendRequests.length
      });

      return res
        .status(200)
        .json({ success: true, message: "Friend request sent successfully" });
    } catch (notificationError) {
      console.error("Error sending notification:", notificationError);

      recipient.friendRequests = recipient.friendRequests.filter(
        (req) => req.userId.toString() !== senderId
      );
      await recipient.save();

      return res.status(500).json({
        success: false,
        message: "Failed to send friend request notification",
      });
    }
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const handleFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const userId = req.userId;
    if (!requestId || !action) {
      return res.status(400).json({
        success: false,
        message: "Request ID and action are required",
      });
    }

    if (action !== "accept" && action !== "reject") {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'accept' or 'reject'",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const requestIndex = user.friendRequests.findIndex(
      (req) => req.userId.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    const request = user.friendRequests[requestIndex];
    if (action === "accept") {
      user.friends.push(request.userId);
      const sender = await User.findById(request.userId);
      if (!sender) {
        return res.status(404).json({
          success: false,
          message: "Sender not found",
        });
      }
      sender.friends.push(userId);
      user.friendRequests.splice(requestIndex, 1);
      const senderRequestIndex = sender.friendRequests.findIndex(
        (req) => req.userId.toString() === userId
      );
      if (senderRequestIndex !== -1) {
        sender.friendRequests.splice(senderRequestIndex, 1);
      }

      await user.save();
      await sender.save();

      return res.status(200).json({
        success: true,
        message: "Friend request accepted and friendship established",
        totalRequest:user.friendRequests.length
      });
    }

    if (action === "reject") {
      user.friendRequests.splice(requestIndex, 1);

      const sender = await User.findById(request.userId);
      if (sender) {
        const senderRequestIndex = sender.friendRequests.findIndex(
          (req) => req.userId.toString() === userId
        );
        if (senderRequestIndex !== -1) {
          sender.friendRequests.splice(senderRequestIndex, 1);
        }
        await sender.save();
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Friend request rejected",
      });
    }
  } catch (error) {
    console.error("Error in handleFriendRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all friend requests for the logged-in user
const getFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "friendRequests.userId",
      "name profilePic"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pendingRequests = user.friendRequests.filter(
      (request) => request.status === "pending"
    );

    const requestList = pendingRequests.map((request) => ({
      requestId: request.userId._id, // Sender's ID
      senderName: request.userId.name,
      senderProfilePic: request.userId.profilePic,
      status: request.status,
    }));

    return res.status(200).json({
      success: true,
      message: "Friend requests fetched successfully",
      data: requestList,
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMutualFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    const userInterests = user.interests;

    const matchingUsers = await User.find({
      _id: { $ne: userId }, // Exclude the logged-in user
      interests: { $in: userInterests },
    }).select("name profilePic interests");

    return res.status(200).json({
      success: true,
      message: "Users with matching interests fetched successfully",
      data: matchingUsers,
    });
  } catch (error) {
    console.error("Error fetching users with matching interests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFriendList = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "friends",
      "name profilePic"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const friendList = user.friends.map((friend) => ({
      id: friend._id,
      name: friend.name,
      profilePic: friend.profilePic,
    }));

    return res.status(200).json({
      success: true,
      message: "Friend list fetched successfully",
      data: friendList,
    });
  } catch (error) {
    console.error("Error fetching friend list:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const removeFriend = async (req, res) => {
  try {
    const userId = req.userId; 
    const { friendId } = req.body; 

    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: "Friend ID is required",
      });
    }

 
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: "User or Friend not found",
      });
    }

    // Remove friendId from user's friend list
    user.friends = user.friends.filter(
      (id) => id.toString() !== friendId.toString()
    );

    // Remove userId from friend's friend list
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Save both users
    await user.save();
    await friend.save();

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully",
      totalFriends: user.friends.length, 
    });
  } catch (error) {
    console.error("Error in removeFriend:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export {
  userList,
  updateProfile,
  sendFriendRequest,
  handleFriendRequest,
  getFriendRequests,
  getMutualFriends,
  getProfile,
  getFriendList,
  removeFriend
};
