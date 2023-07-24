const User = require("../models/User");

const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if the user is trying to send a friend request to themselves
    if (currentUser._id === userId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    // Check if the target user already has a pending friend request from the current user
    const targetUser = await User.findById(userId);

    // Filter out null elements from targetUser.friendRequests
    const filteredFriendRequests = targetUser.friendRequests.filter(
      (request) => request && request._id
    );

    if (
      filteredFriendRequests.some((request) =>
        request._id == currentUser._id
      ) 
    ) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
     if (
      currentUser.friends.some((friend) =>
        userId == friend
      ) 
    ) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Update the target user's friend requests list and add the current user
    targetUser.friendRequests.push({
      _id: currentUser._id,
      sender: {
        userId: currentUser._id,
        username: currentUser.username,
      },
    });
    await targetUser.save();

    return res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const currentUser = req.user;
    const friendRequests = await User.find({
      _id: { $in: currentUser.friendRequests },
    })
      .select("_id")
      .populate("friendRequests", "username");

    console.log("Friend Requests:", friendRequests);

    const friendRequestsData = friendRequests.map((request) => ({
      requestId: request._id,
      sender: {
        userId: request.friendRequests._id,
        username: request.friendRequests.username,
      },
    }));
    res.json(friendRequestsData);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Accept a friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUser = req.user;
    console.log(requestId);
    // Find the friend request by its ID
    const friendRequest = currentUser.friendRequests.find(
      (request) => request._id == requestId
    );
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    const sender = await User.findById(friendRequest._id).select(
      "username"
    );
    if (!sender) {
      return res.status(404).json({ message: "Sender user not found" });
    }
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (request) => request._id != (requestId)
    );

    currentUser.friends.push(friendRequest._id);
    await currentUser.save();

    return res.json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reject a friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUser = req.user;

    // Find the friend request by its ID
    const friendRequest = currentUser.friendRequests.find(
      (request) => request._id == requestId
    );

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Remove the friend request from the current user's friendRequests array
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (request) => request._id != requestId
    );

    await currentUser.save();

    return res.json({ message: "Friend request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
};
