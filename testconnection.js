// import db from "./models/index.js";

// (async () => {
//   try {
//     await db.sequelize.authenticate();
//     console.log("✅ DB connected successfully");
//   } catch (err) {
//     console.error("❌ DB connection failed:", err);
//   } finally {
//     process.exit();
//   }
// })();

import db from "./models/index.js";

(async () => {
  try {
    console.log("🔄 Connecting to DB...");
    await db.sequelize.authenticate();
    console.log("✅ Connected successfully");

    console.log("🔄 Dropping all tables...");
    await db.sequelize.drop(); // drops all tables
    console.log("✅ All tables dropped!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit();
  }
})();
