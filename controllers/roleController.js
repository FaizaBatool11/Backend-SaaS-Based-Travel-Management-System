// controllers/roleController.js
import db from "../models/index.js";
const { Role, Permission } = db;

// ✅ Create Role
export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
   
    // Duplicate check
    const existing = await Role.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({ name, description });

    // Agar permissions diye gaye hain to associate kar do
    if (permissions && permissions.length > 0) {
      const perms = await Permission.findAll({
        where: { id: permissions },
      });
      await role.setPermissions(perms);
    }

    const fullRole = await Role.findByPk(role.id, {
      include: [{ model: Permission, as: "permissions" }],
    });

    res.status(201).json({ message: "Role created successfully", role: fullRole });
  } catch (error) {
    console.error("Role Create Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: "permissions", // ✅ must match alias
        },
      ],
    });

    res.json(roles);
  } catch (error) {
    console.error("Fetch Roles Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  const roleId = req.params.id;
  const { name, description, permissions } = req.body;

  try {
    // 1️⃣ Find role
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // 2️⃣ Update role name/description
    role.name = name || role.name;
    role.description = description || role.description;
    await role.save();

    // 3️⃣ Update permissions if array is provided
    if (Array.isArray(permissions)) {
      await role.setPermissions(permissions); // expects array of IDs
    }

    // 4️⃣ Return updated role with permissions
    const updatedRole = await Role.findByPk(roleId, {
      include: [{ model: Permission, as: "permissions" }],
    });

    res.json({ role: updatedRole });
  } catch (err) {
    console.error("Update Role Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.destroy();
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete role" });
  }
};