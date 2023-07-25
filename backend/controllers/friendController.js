const User = require("../models/User");
const mongoose = require('mongoose');


const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if the user is trying to send a friend request to themselves
    if (currentUser._id.equals(userId)) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    // Check if the target user is already in the current user's friends list
    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: 'You are already friends with this user' });
    }

    // Check if the target user already has a pending friend request from the current user
    const targetUser = await User.findById(userId);

    // Filter out null elements from targetUser.friendRequests
    const filteredFriendRequests = targetUser.friendRequests.filter(
      (request) => request && request.sender.userId
    );

    if (filteredFriendRequests.some((request) => request.sender.userId.equals(currentUser._id))) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Update the target user's friend requests list and add the current user
    targetUser.friendRequests.push({
      requestId: new mongoose.Types.ObjectId(), // Generate a unique ID for the friend request
      sender: {
        userId: currentUser._id,
        username: currentUser.username,
        friends: [],
      },
    });
    await targetUser.save();

    return res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return res.status(500).json({ message: 'Internal server error' });
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

    // Find the friend request by its ID
    const friendRequest = currentUser.friendRequests.find(
      (request) => request._id == requestId
    );

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const sender = await User.findById(friendRequest.sender.userId).select(
      "username friends"
    );

    if (!sender) {
      return res.status(404).json({ message: "Sender user not found" });
    }

    // Remove the friend request from the current user's friendRequests array
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (request) => request._id != requestId
    );

    // Add the sender to the current user's friends
    currentUser.friends.push(friendRequest.sender.userId);

    // Add the current user to the sender's friends
    sender.friends.push(currentUser._id);

    await Promise.all([currentUser.save(), sender.save()]);

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
// Unfriend a user
const unfriendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if the target user is in the current user's friends list
    if (!currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: 'You are not friends with this user' });
    }

    // Check if the current user is in the target user's friends list
    const targetUser = await User.findById(userId);
    if (!targetUser.friends.includes(currentUser._id)) {
      return res.status(400).json({ message: 'The target user is not your friend' });
    }

    // Remove the target user's ID from the current user's friends array
    currentUser.friends = currentUser.friends.filter((friendId) => friendId.toString() !== userId);

    // Remove the current user's ID from the target user's friends array
    targetUser.friends = targetUser.friends.filter((friendId) => friendId.toString() !== currentUser._id.toString());

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.json({ message: 'Unfriended successfully' });
  } catch (error) {
    console.error('Error unfriending user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  unfriendUser, 
};
