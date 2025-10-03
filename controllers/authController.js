import db from "../models/index.js";
const {User, Role, Permission, UserAgency, Agency} = db;
export const loginUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Agency,
          as: "agencies",
          through: { attributes: [] },
        },
      ],
    });

    // if user has default agency, fetch userAgency row with role + permissions
    let permissions = [];
    let role = null;
    if (req.user.agencyId) {
      const userAgency = await UserAgency.findOne({
        where: { userId: req.user.id, agencyId: req.user.agencyId },
        include: [{ model: Role, as: "role", include: [{ model: Permission, as: "permissions" }] }],
      });
      if (userAgency && userAgency.role) {
        role = userAgency.role.name;
        permissions = (userAgency.role.permissions || []).map(p => p.name);
      }
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      agencies: user.agencies.map(a => ({ id: a.id, name: a.name })),
      agencyId: req.user.agencyId || null,
      role,
      permissions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};