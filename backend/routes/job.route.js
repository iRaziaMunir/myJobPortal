import express from "express"
import { postJob, getAllJobs, getJobById, getAdminJobs } from "../controllers/job.controller.js"

export const router = express.Router();

router.post('/postjob', postJob);
router.get('/getalljobs', getAllJobs);
router.get('/getjobbyid/:id', getJobById);
router.get('/getadminjobs', getAdminJobs);

export default router;