const User = require('../models/User');

// Follow a user
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;


    // Check if the user is already following the target user
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Update the current user's following list and add the target user
    const updatedCurrentUser = await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $addToSet: { following: userId } }, // Use $addToSet to avoid duplicates
      { new: true }
    );

    // Update the target user's followers list and add the current user
    const updatedTargetUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { followers: currentUser._id } }, // $addToSet to avoid duplicates
      { new: true }
    );


    return res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Error following user:', error);
    return res.status(500).json({ message: 'Internal server error' });
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

    console.log('Updated Current User:', updatedCurrentUser);
    console.log('Updated Target User:', updatedTargetUser);

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