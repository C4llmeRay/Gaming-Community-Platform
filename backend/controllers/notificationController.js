const Notification = require("../models/Notification");

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all notifications for the user
    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1, // Sort by createdAt in descending order to get the latest notifications first
    });

    return res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getNotifications,
};
