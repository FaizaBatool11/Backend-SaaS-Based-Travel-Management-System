import db from "../models/index.js";

const { Permission } = db;

// ✅ Get all permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ["id", "name", "description"],
      order: [["id", "ASC"]],
    });
    res.status(200).json(permissions);
  } catch (err) {
    console.error("Error fetching permissions:", err);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
};

// ✅ Create new permission (optional, for Owner only)
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Permission name is required" });
    }

    // check duplicate
    const exists = await Permission.findOne({ where: { name } });
    if (exists) {
      return res.status(400).json({ message: "Permission already exists" });
    }

    const permission = await Permission.create({
      name,
      description: description || null,
    });

    res.status(201).json({ message: "Permission created successfully", permission });
  } catch (err) {
    console.error("Error creating permission:", err);
    res.status(500).json({ message: "Failed to create permission" });
  }
};
