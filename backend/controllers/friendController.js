const User = require("../models/User");
const mongoose = require('mongoose');
const Notification = require("../models/Notification");

const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    // Check if the user is trying to send a friend request to themselves
    if (currentUser._id.equals(userId)) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }
    // Check if the target user is already in the current user's friends list
    if (currentUser.friends.some((friend) => friend.userId.equals(userId))) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }
    // Check if the target user already has a pending friend request from the current user
    const targetUser = await User.findById(userId);
    // Filter out null elements from targetUser.friendRequests
    const filteredFriendRequests = targetUser.friendRequests.filter(
      (request) => request && request.sender.userId
    );
    if (
      filteredFriendRequests.some((request) =>
        request.sender.userId.equals(currentUser._id)
      )
    ) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    // Generate a unique ID for the friend request
    const requestId = new mongoose.Types.ObjectId();
    // Update the target user's friend requests list and add the current user
    targetUser.friendRequests.push({
      requestId,
      sender: {
        userId: currentUser._id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        friends: [],
      },
    });
    await targetUser.save();

    // Create a notification for the target user
    const notification = new Notification({
      recipient: userId,
      type: "friend_request",
      data: {
        requestId, 
        senderId: currentUser._id,
        senderUsername: currentUser.username,
      },
    });
    await notification.save();

    return res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const currentUser = req.user;

    // Use the populate method on the currentUser model directly
    await currentUser
      .populate({
        path: "friendRequests.sender",
        select: "username avatar", // Select the desired fields
      })
      .execPopulate();

    // Extract the friendRequests array from the populated field
    const friendRequests = currentUser.friendRequests;

    console.log("Friend Requests:", friendRequests);

    const friendRequestsData = friendRequests.map((request) => ({
      requestId: request._id, // Use request._id instead of request.friendRequests._id
      sender: {
        userId: request.sender._id, // Use request.sender._id
        username: request.sender.username,
        avatar: request.sender.avatar,
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

    // Find the friend request by its ID
    const friendRequest = currentUser.friendRequests.find(
      (request) => request._id == requestId
    );

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const sender = await User.findById(friendRequest.sender.userId).select(
      "username friends avatar" 
    );

    if (!sender) {
      return res.status(404).json({ message: "Sender user not found" });
    }

    // Remove the friend request from the current user's friendRequests array
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (request) => request._id != requestId
    );

    // Add the sender to the current user's friends
    currentUser.friends.push({
      userId: friendRequest.sender.userId,
      username: friendRequest.sender.username,
      avatar: sender.avatar, 
    });

    // Add the current user to the sender's friends
    sender.friends.push({
      userId: currentUser._id,
      username: currentUser.username,
      avatar: currentUser.avatar, 
    });

    await Promise.all([currentUser.save(), sender.save()]);

    // Create and save the notification for the current user
    const notification = new Notification({
      recipient: currentUser._id,
      type: "friend_request_accepted",
      data: {
        senderId: friendRequest.sender.userId,
        senderUsername: friendRequest.sender.username,
      },
    });

    await notification.save();

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

// Unfriend a user
const unfriendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if the target user is in the current user's friends list
    const targetUserIndex = currentUser.friends.findIndex(
      (friend) => friend.userId.toString() === userId
    );
    if (targetUserIndex === -1) {
      return res.status(400).json({ message: 'You are not friends with this user' });
    }

    // Check if the current user is in the target user's friends list
    const targetUser = await User.findById(userId);
    const currentUserIndex = targetUser.friends.findIndex(
      (friend) => friend.userId.toString() === currentUser._id.toString()
    );
    if (currentUserIndex === -1) {
      return res.status(400).json({ message: 'The target user is not your friend' });
    }

    // Remove the target user's entry from the current user's friends array
    currentUser.friends.splice(targetUserIndex, 1);

    // Remove the current user's entry from the target user's friends array
    targetUser.friends.splice(currentUserIndex, 1);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.json({ message: 'Unfriended successfully' });
  } catch (error) {
    console.error('Error unfriending user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Get user's friends
const getUserFriends = async (req, res) => {
  try {
    const currentUser = req.user;
    const friends = await User.find({ _id: { $in: currentUser.friends } })
      .exec();

    // Map the results to include only _id and username
    const friendData = friends.map(({ _id, username }) => ({ _id, username }));

    console.log('Fetched Friends:', friendData);

    res.json(friendData);
  } catch (error) {
    console.error("Error fetching user friends:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  unfriendUser, 
  getUserFriends,
};
