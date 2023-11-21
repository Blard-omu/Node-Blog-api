import express  from "express";
import { login, register } from "../controllers/authController.js"
import { verifyToken } from "../middlewares/auth.js";
import {
    googleAuth,
    googleAuthCallback,
    googleAuthCallbackRedirect,
  } from '../controllers/socialAuth/auth.js';

const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.post('/verify-token', verifyToken)


    
  // Google OAuth routes
  router.get('/google', googleAuth);
  router.get('/google/callback', googleAuthCallback, googleAuthCallbackRedirect);
  
  // Other authentication routes

export default router;

 


