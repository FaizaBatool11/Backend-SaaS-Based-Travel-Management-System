
import dotenv from "dotenv"
dotenv.config();
const config = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "faiza123",
    database: process.env.DB_NAME || "travel",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "faiza123",
    database: process.env.DB_NAME || "travel",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "faiza123",
    database: process.env.DB_NAME || "travel",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
};

export default config;