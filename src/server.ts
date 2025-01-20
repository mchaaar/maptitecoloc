import dotenv from "dotenv";
import { connectMongooseDB } from "./configs/databases/mongoose.config";
import { connectMySQLDB } from "./configs/databases/mysql.config";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

Promise.all([
  connectMySQLDB.initialize(), // Connexion à MySQL
  connectMongooseDB(),        // Connexion à MongoDB
]).then(() => {
  console.log("Connected to MySQL and MongoDB!");

  // Lancer le serveur
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error("Failed to initialize databases:", error);
  process.exit(1); // Arrêter le processus si une connexion échoue
});