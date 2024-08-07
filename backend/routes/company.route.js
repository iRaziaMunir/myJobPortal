import express from 'express';
import { registerCompany, getCompany, getCompanyById, updateCompany } from '../controllers/company.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';


const router = express.Router();

// Define your routes here
router.post('/register', isAuthenticated, registerCompany);
router.get('/getcompany', isAuthenticated, getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/update/:id', isAuthenticated,updateCompany);

export default router;
