import express  from "express";
import { login, register } from "../controllers/authController.js"
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.post('/verify-token', verifyToken)

export default router;

 


