import express from 'express'
import { registerUser,loginUser, logoutUser, getCurrentUser } from '../controller/auth.controller.js';
import { verifyUser } from '../middleware/verifyUser.middleware.js';
const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post(`/logout`,logoutUser)
router.get('/me/',verifyUser,getCurrentUser)
export default router;