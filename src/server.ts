import dotenv from "dotenv";
import { connectMongooseDB } from "./configs/databases/mongoose.config";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectMongooseDB()
  .then(() => {
    console.log("Connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
