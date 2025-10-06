// import fs from "fs";
// import path from "path";
// import { Sequelize, DataTypes } from "sequelize";
// import process from "process";
// import url, { pathToFileURL } from "url";
// import db from "../models/index.js";
// const { UserAgency, Role, Permission } = db;


// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";

// // Load config.json
// const configPath = path.join(__dirname, "../config/config.json");
// const configJson = JSON.parse(fs.readFileSync(configPath, "utf-8"));
// const config = configJson[env];

// const db = {};

// // Initialize Sequelize
// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// // Import all models dynamically
// const files = fs
//   .readdirSync(__dirname)
//   .filter(
//     (file) =>
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.slice(-3) === ".js" &&
//       !file.endsWith(".test.js")
//   );

// for (const file of files) {
//   const fileUrl = pathToFileURL(path.join(__dirname, file)).href;
//   const module = await import(fileUrl);

//   // Call the factory function with (sequelize, DataTypes)
//   const model = module.default(sequelize, DataTypes);
//   db[model.name] = model;
// }

// // Setup associations
// for (const modelName of Object.keys(db)) {
//   if (typeof db[modelName].associate === "function") {
//     db[modelName].associate(db);
//   }
// }

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;

// models/index.js
import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import url, { pathToFileURL } from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Load config.json
import configFile from "../config/config.js";
const config = configFile[env];

// Initialize Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Create db object
const db = {};

// Dynamically import all models
const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.endsWith(".test.js")
  );

for (const file of files) {
  const fileUrl = pathToFileURL(path.join(__dirname, file)).href;
  const module = await import(fileUrl);

  // module.default should be a function returning the model
  const model = module.default(sequelize, DataTypes);
  db[model.name] = model;
}

// Setup associations if defined
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
}

// Add Sequelize instance and class
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Default export
export default db;
