import { Router } from "express";
import * as userController from "../../controllers/user.controller";

const routes = Router();

routes.post("/register", userController.registerUser);

export default routes;