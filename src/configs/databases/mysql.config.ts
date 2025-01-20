import { DataSource } from "typeorm";

export const connectMySQLDB = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "maptitecoloc",
  synchronize: true, // Attention : activez uniquement en développement
  logging: false,
  entities: ["src/databases/mysql/*.ts"], // Entités de votre projet
  migrations: ["src/migrations/**/*.ts"], // Scripts de migration
});