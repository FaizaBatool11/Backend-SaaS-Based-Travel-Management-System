import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import url, { pathToFileURL } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Import config file
import configFile from "../config/config.js";
const config = configFile[env];

// Initialize Sequelize instance
let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ For Railway (or any hosted database)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // important for Railway
      },
    },
    logging: false,
  });
} else {
  // ✅ For Local MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME || config.database,
    process.env.DB_USER || config.username,
    process.env.DB_PASSWORD || config.password,
    {
      host: process.env.DB_HOST || config.host,
      port: process.env.DB_PORT || config.port || 3306,
      dialect: "mysql",
      logging: false,
    }
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

  const model = module.default(sequelize, DataTypes);
  db[model.name] = model;
}

// Setup model associations if defined
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
}

// Attach sequelize and Sequelize to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
