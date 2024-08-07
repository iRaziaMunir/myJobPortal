import express from 'express';
import { register, login, updateProfile, logout } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Define your routes here
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/profile/update',isAuthenticated, updateProfile);

export default router;
