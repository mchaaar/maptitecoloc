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
  console.error(err);

  /**
   * By default:
   * {
   *   statusCode: 500,
   *   errorCode: "INTERNAL_SERVER_ERROR",
   *   errMessage: "An unexpected error occurred"
   * }
   */
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";
  const errMessage = err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    statusCode,
    errorCode,
    errMessage,
  });
});

export default app;