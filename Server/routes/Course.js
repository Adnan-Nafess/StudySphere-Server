// Import the required modules
import express from "express";
const router = express.Router();

// Import the Controllers

// Course Controllers Import
import {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} from "../controllers/Course.js";

// Tag Controllers Import
import {
  showAllTags,
  createTag,
  tagDetails,
} from "../controllers/Tag.js";

// Sections Controllers Import
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section.js";

// Sub-Sections Controllers Import
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/SubSection.js";

// Rating Controllers Import
import {
  createRatingAndReview,
  getAverageRating,
  getAllRatingsAndReviews,
} from "../controllers/RatingAndReview.js";

import { updateCourseProgress } from "../controllers/courseProgress.js";

// Importing Middlewares
import { auth, isInstructor, isStudent, isAdmin } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Course
router.post("/getCourseDetails", getCourseDetails);
// Get Full Details for a Specific Course
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Delete a Course
router.delete("/deleteCourse", deleteCourse);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
router.post("/createTag", auth, isAdmin, createTag);
router.get("/showAllTags", showAllTags);
router.post("/getTagsDetails", tagDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingAndReview);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingsAndReviews);

// Export router as default
export default router;
