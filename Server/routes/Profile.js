import express from "express";
import { auth, isInstructor } from "../middlewares/auth.js";
import {
  updateProfile,
  getProfile,
  deleteProfile,
  updateDisplayPicture,
  getAllUserDetails,
} from "../controllers/Profile.js";

const router = express.Router();

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete("/deleteProfile", auth, deleteProfile);
router.put("/updateProfile", auth, updateProfile);
router.get("/getProfile", auth, getProfile);
router.get("/getUserDetails", auth, getAllUserDetails);

// // Get Enrolled Courses
// router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

export default router;
