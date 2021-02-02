import { Router } from "express";

import Auth   from "./auth";
import Emotes from "./emotes";

import authMiddleware from "../middleware/auth";

const router = Router();

router.use("/auth",  Auth);
router.use("/emotes", authMiddleware, Emotes);

router.use((_, res) => {
    res.status(404);
    res.json({ message: "I don't think you're supposed to be here!" });
});

export default router;
