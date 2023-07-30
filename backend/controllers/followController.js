const User = require('../models/User');
const Notification = require("../models/Notification");
const { getNotificationSocket } = require("../sockets/notificationSocket"); 
const io = getNotificationSocket();


const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if the user is already following the target user
    if (currentUser.following.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Update the current user's following list and add the target user
    const updatedCurrentUser = await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $addToSet: { following: userId } },
      { new: true }
    );

    // Update the target user's followers list and add the current user
    const updatedTargetUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { followers: currentUser._id } },
      { new: true }
    );

    // Emit a follow notification to the targeted user
    if (io) {
      io.to(userId).emit("follow", { followerId: currentUser._id });

      // Save the notification in the database
      const notification = new Notification({
        recipient: userId,
        type: "follow",
        data: { followerId: currentUser._id },
      });
      await notification.save();
    }

    console.log("Successfully followed user");
    return res.json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Update the current user's following list and remove the target user
    const updatedCurrentUser = await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $pull: { following: userId } },
      { new: true }
    );

    // Update the target user's followers list and remove the current user
    const updatedTargetUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { followers: currentUser._id } },
      { new: true }
    );


    return res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  followUser,
  unfollowUser,
};