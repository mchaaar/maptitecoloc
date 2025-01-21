import express from "express";
import cors from "cors";
import helmet from "helmet";
import "reflect-metadata";

import { requestLogger } from "./middlewares/requestLogger.middleware";

import userRoutes from "./routes/user/user.routes";
import colocationRoutes from "./routes/colocation/colocation.routes";
import taskRoutes from "./routes/user/task.routes"; 
import chargeRoutes from "./routes/charge/charge.routes";
import paymentRoutes from "./routes/payment/payment.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(requestLogger);

app.get("/", (req, res) => {
  throw new Error("Il n'y a rien d'implémenté dans cette route, à vous de jouer !");
});

app.use("/api/users", userRoutes);
app.use("/api/colocations", colocationRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/charges", chargeRoutes);
app.use("/api/payments", paymentRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);

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
