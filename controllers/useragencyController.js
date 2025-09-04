import db from "../models/index.js";
const { UserAgency } = db;

// ✅ 1. Assign user to an agency
export const assignUserToAgency = async (req, res) => {
  try {
    const { userId, agencyId } = req.body;

    const record = await UserAgency.create({ userId, agencyId });

    res.status(201).json({
      message: "User assigned to agency successfully",
      record,
    });
  } catch (error) {
    console.error("Assign Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ 2. Get all agencies of a user
export const getUserAgencies = async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await UserAgency.findAll({ where: { userId } });

    res.status(200).json(records);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ 3. Remove user from an agency
export const removeUserFromAgency = async (req, res) => {
  try {
    const { userId, agencyId } = req.body;

    await UserAgency.destroy({ where: { userId, agencyId } });

    res.status(200).json({ message: "User removed from agency" });
  } catch (error) {
    console.error("Remove Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
