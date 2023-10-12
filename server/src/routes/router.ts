import {Router} from "express";
import connectAuthRoutes from "./authRoutes";

const router = Router();

function createRouter() {
    connectAuthRoutes(router)
}

createRouter()

export default router;