import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user/user.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  throw new Error("Il n'y a rien d'implémenté dans cette route, à vous de jouer !");
});

app.use("/api/users", userRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    errorCode: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "An unexpected error occurred",
  });
});

export default app;