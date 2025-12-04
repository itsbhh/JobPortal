import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

//  Public route (anyone can view job listings)
router.route("/get").get(getAllJobs);

//  Public route (anyone can view job details)
router.route("/get/:id").get(getJobById);

//  Protected routes (only authenticated users can post and see admin jobs)
router.route("/post").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

export default router;
