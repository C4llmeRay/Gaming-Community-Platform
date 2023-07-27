const GamingGroup = require("../models/GamingGroup");

exports.createGroup = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, description, rules, privacy, game } = req.body;

    const newGroup = new GamingGroup({
      name,
      description,
      rules,
      privacy,
      game,
      owner,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating gaming group:", error);
    res.status(500).json({ message: "Failed to create gaming group." });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const group = await GamingGroup.findById(req.params.groupId)
      .populate("members")
      .populate({
        path: "chatMessages",
        populate: {
          path: "sender",
          model: "User",
        },
      });

    // .populate('members')
    // .populate('chatMessages');

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch group details." });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const group = await GamingGroup.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group." });
    }

    group.members.push(userId);
    await group.save();
    res.json({ message: "Successfully joined the group." });
  } catch (error) {
    res.status(500).json({ message: "Failed to join the group." });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const group = req.group;
    const user = req.user;

    // Check if the user is a member of the group
    if (!group.members.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    // Remove the user from the group's members array
    group.members = group.members.filter((memberId) => memberId !== user._id);
    await group.save();

    res.json({ message: "You have left the group successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave the group" });
  }
};

exports.transferOwnership = async (req, res) => {
  try {
    const group = req.group;
    const currentOwner = req.user;
    const newOwnerId = req.body.newOwnerId;

    // Check if the current user is the owner of the group
    if (group.owner.toString() !== currentOwner._id.toString()) {
      return res
        .status(400)
        .json({ message: "Only the owner can transfer ownership" });
    }

    // Check if the new owner is a member of the group
    if (!group.members.includes(newOwnerId)) {
      return res
        .status(400)
        .json({ message: "The new owner must be a member of the group" });
    }

    // Transfer ownership
    group.owner = newOwnerId;
    await group.save();

    res.json({ message: "Ownership transferred successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to transfer ownership" });
  }
};

exports.kickMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const memberId = req.body.memberId;
    console.log("Group ID received:", groupId);
    console.log("Member ID received:", memberId);

    // Find the group by ID
    const group = await GamingGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user performing the action is the group owner or a moderator
    const user = req.user;
    if (
      group.owner.toString() !== user._id.toString() &&
      !group.moderators.includes(user._id.toString())
    ) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    // Check if the member to be kicked is in the group
    const memberIndex = group.members.findIndex(
      (member) => member._id.toString() === memberId
    );
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in the group" });
    }

    // Remove the member from the group's members array
    group.members.splice(memberIndex, 1);
    await group.save();

    res.status(200).json({ message: "Member has been removed from the group" });
  } catch (error) {
    console.error("Error kicking member:", error);
    res.status(500).json({ message: "Failed to kick member from the group" });
  }
};

exports.promoteMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const memberId = req.body.memberId;
    console.log("Group ID received:", groupId);
    console.log("Member ID received:", memberId);

    // Find the group by ID
    const group = await GamingGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user performing the action is the group owner
    const user = req.user;
    if (group.owner.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the group owner can promote members" });
    }

    // Check if the member to be promoted is in the group
    const memberIndex = group.members.findIndex(
      (member) => member._id.toString() === memberId
    );
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in the group" });
    }

    // Check if the member is already a moderator
    if (group.moderators.includes(memberId)) {
      return res.status(409).json({ message: "Member is already a moderator" });
    }

    // Promote the member to a moderator
    group.moderators.push(memberId);
    await group.save();

    res
      .status(200)
      .json({ message: "Member has been promoted to a moderator" });
  } catch (error) {
    console.error("Error promoting member:", error);
    res.status(500).json({ message: "Failed to promote member" });
  }
};

exports.demoteMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const memberId = req.body.memberId;

    // Find the group by ID
    const group = await GamingGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user performing the action is the group owner
    const user = req.user;
    if (group.owner.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the group owner can demote members" });
    }

    // Check if the member to be demoted is in the group
    if (!group.members.includes(memberId)) {
      return res.status(404).json({ message: "Member not found in the group" });
    }

    // Check if the member is not a moderator
    if (!group.moderators.includes(memberId)) {
      return res.status(409).json({ message: "Member is not a moderator" });
    }

    // Demote the member from a moderator to a regular member
    group.moderators = group.moderators.filter(
      (moderator) => moderator.toString() !== memberId
    );
    await group.save();

    res
      .status(200)
      .json({ message: "Member has been demoted to a regular member" });
  } catch (error) {
    console.error("Error demoting member:", error);
    res.status(500).json({ message: "Failed to demote member" });
  }
};
