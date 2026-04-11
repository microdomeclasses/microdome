import { Router } from "express";

import {
  createCourse,
  getAllCourses,
  addSection,
  addLecture,
  updateLecture,
  updateSection,
  addLectureToASection,
  addNewCourse,
  getFullCourse,
  getCourseDetails,
  getCourseById,
  getEnrolledCourses,
  getAllSections,
  updateCourse,
  deleteSection,
  deleteLecture,
  getSectionsWithLectures,
  toggleCourseArchive,
  clearCourseEnrollments,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/course.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import { isEnrolledInCourse } from "../middlewares/isAuthorized.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";

const router = Router();

router
  .route("/create-course")
  .post(verifyJWT, authorizedRoles("admin"), upload.fields([{ name: "courseImage", maxCount: 1 }]), createCourse);



router
  .route("/update-course/:courseId")
  .patch(
    verifyJWT,
    authorizedRoles("admin"),
    upload.fields([{ name: "courseImage", maxCount: 1 }]),
    updateCourse
  );

router.route("/get-all-courses").get(getAllCourses);
router.route("/:courseId").get(getCourseById);

router.route("/:courseId/sections").post(verifyJWT , authorizedRoles("admin", "instructor") , addSection);
router.route("/sections/:sectionId").patch(verifyJWT , authorizedRoles("admin", "instructor") , updateSection);
router.route("/sections/:sectionId").delete(verifyJWT , authorizedRoles("admin", "instructor") , deleteSection);


router.route("/:courseId/sections-with-lectures").get(verifyJWT, authorizedRoles("admin", "instructor"), getSectionsWithLectures);


router.route("/sections/:sectionId/lectures").post(verifyJWT , authorizedRoles("admin", "instructor") , upload.fields([{ name: "noteURL", maxCount: 1 }]), addLecture);
router.route("/lectures/:lectureId").patch(verifyJWT , authorizedRoles("admin", "instructor") , upload.fields([{ name: "noteURL", maxCount: 1 }]), updateLecture);
router.route("/sections/:sectionId/lectures/:lectureId").delete(verifyJWT , authorizedRoles("admin", "instructor") , deleteLecture);

router.route("/update-section").post(addLectureToASection);

router.route("/add-new-course").post(addNewCourse);

router.route("/get-full-course/:id").get(verifyJWT, isEnrolledInCourse, getFullCourse);

router.route("/get-course-details/:id").get(verifyJWT, authorizedRoles("admin", "instructor"), getCourseDetails);

router.route("/get-enrolled-courses").post(getEnrolledCourses);

router.route("/get-all-sections/:id").get(getAllSections);

router.route("/:courseId/archive").patch(verifyJWT, authorizedRoles("admin"), toggleCourseArchive);

router.route("/:courseId/clear-enrollments").delete(verifyJWT, authorizedRoles("admin"), clearCourseEnrollments);

router.route("/:courseId/books").post(verifyJWT, authorizedRoles("admin", "instructor"), addBook);
router.route("/:courseId/books/:bookIndex").put(verifyJWT, authorizedRoles("admin", "instructor"), updateBook);
router.route("/:courseId/books/:bookIndex").delete(verifyJWT, authorizedRoles("admin", "instructor"), deleteBook);

export default router;
