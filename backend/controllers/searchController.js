const User = require("../models/User");
const GamingGroup = require("../models/GamingGroup");
const GamingSession = require("../models/GamingSession");

const searchGroups = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Perform the search query for gaming groups
    const groups = await GamingGroup.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(groups);
  } catch (error) {
    console.error("Error searching for groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchFriends = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Perform the search query for friends using the keyword parameter
    const friends = await User.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(friends);
  } catch (error) {
    console.error("Error searching for friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchSessions = async (req, res) => {
  try {
    const { keyword } = req.query;

    const sessions = await GamingSession.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(sessions);
  } catch (error) {
    console.error("Error searching for gaming sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchGroups, searchFriends, searchSessions };
