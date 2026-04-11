import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Section } from "../models/section.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import { MonthlyFee } from "../models/monthlyFee.model.js";


import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { notifyStudentsNewLecture } from "../utils/sendLectureNotification.js";

const normalizeUniversity = (name) => {
  if (!name) return null;

  return name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^\w]/g, "");
};

const createCourse = async (req, res) => {
  try {
    const {
      cardTitle,
      subTitle,
      courseTag,
      category,
      university,
      tags,
      mode,
      language,
      actualPrice,
      discountedPrice,
      courseTitle,
      courseDescription,
      whatsappLink,
      isFeatured,
      syllabusUrl,
    } = req.body;

    /* ================= VALIDATION ================= */

    // normalize first
    const actual = Number(actualPrice);
    const discounted = Number(discountedPrice);

    if (
      !subTitle ||
      !mode ||
      !language ||
      !courseTitle ||
      !courseDescription ||
      !whatsappLink ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // price validation
    if (isNaN(actual) || isNaN(discounted)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });
    }

    if (actual < 0 || discounted < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    if (discounted > actual) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot exceed actual price",
      });
    }

    // category-specific validation
    if (category === "semester_course" && !university) {
      return res.status(400).json({
        success: false,
        message: "University is required for semester courses",
      });
    }

    /* ================= IMAGE ================= */

    const courseImageLocalPath = req.files?.courseImage?.[0]?.path;

    if (!courseImageLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Course image is required",
      });
    }

    const uploadedcourseImage = await uploadOnCloudinary(courseImageLocalPath);

    if (!uploadedcourseImage?.secure_url) {
      return res.status(400).json({
        success: false,
        message: "Error while uploading the course image",
      });
    }

    /* ================= TAG CLEANING ================= */

    let cleanedTags = [];

    if (tags !== undefined) {
      try {
        const parsed = typeof tags === "string" ? JSON.parse(tags) : tags;

        if (Array.isArray(parsed)) {
          cleanedTags = [
            ...new Set(
              parsed.map((t) => t.toLowerCase().trim()).filter(Boolean),
            ),
          ];
        }
      } catch (err) {
        console.warn("Invalid tags format, ignoring...");
      }
    }

    /* ================= CREATE ================= */

    const course = await Course.create({
      cardTitle: cardTitle || courseTitle, // fallback
      subTitle,
      courseTag,
      category,
      university:
        category === "semester_course"
          ? normalizeUniversity(university?.trim())
          : null,
      tags: cleanedTags,
      mode,
      language,
      actualPrice: Number(actualPrice),
      discountedPrice: Number(discountedPrice),
      courseImage: uploadedcourseImage.secure_url,
      courseTitle,
      courseDescription,
      whatsappLink,
      isFeatured: String(isFeatured) === "true",
      syllabusUrl: syllabusUrl || null,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating course",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { featured } = req.query;

    // ALWAYS active courses
    let filter = {
      isArchived: false,
    };

    // OPTIONAL filter
    if (featured !== undefined) {
      filter.isFeatured = featured === "true";
    }

    const courses = await Course.find(filter)
      .select("-sections -__v")
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

const addLecture = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, videoURL, noteTitle } = req.body;

    /* ================= VALIDATION ================= */

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID is required",
      });
    }

    if (!title || !videoURL) {
      return res.status(400).json({
        success: false,
        message: "Title and video URL are required",
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    /* ================= FILE UPLOAD ================= */

    let noteURL = "";

    const notePath = req.files?.noteURL?.[0]?.path;

    if (notePath) {
      const uploaded = await uploadOnCloudinary(notePath);

      if (!uploaded?.secure_url) {
        return res.status(400).json({
          success: false,
          message: "Error while uploading the note",
        });
      }

      noteURL = uploaded.secure_url;
    }

    /* ================= CREATE LECTURE ================= */

    const lecture = await Lecture.create({
      title: title.trim(),
      videoURL: videoURL.trim(),
      noteTitle: noteTitle || "",
      noteURL,
    });

    /* ================= UPDATE SECTION ================= */

    section.lectures.push(lecture._id);
    await section.save();

    /* ================= NOTIFY ================= */

    await notifyStudentsNewLecture({
      courseId: section.courseId,
      lectureId: lecture._id,
      lectureTitle: lecture.title,
    });

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      success: true,
      message: "Lecture added successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error in addLecture:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: "lectureId is required",
      });
    }

    const { title, videoURL, noteTitle } = req.body;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    /* ================= FILE HANDLING ================= */

    if (req.files?.noteURL?.[0]?.path) {
      const newNotePath = req.files.noteURL[0].path;

      // upload new note
      const uploaded = await uploadOnCloudinary(newNotePath);

      if (!uploaded?.secure_url) {
        return res.status(400).json({
          success: false,
          message: "Error while uploading new note",
        });
      }

      // delete old note (NON-BLOCKING)
      if (lecture.noteURL) {
        try {
          await deleteFromCloudinary(lecture.noteURL);
        } catch (err) {
          console.error("Error deleting old note:", err);
          // don't break execution
        }
      }

      // assign new note
      lecture.noteURL = uploaded.secure_url;
    }

    /* ================= FIELD UPDATES ================= */

    if (title !== undefined) {
      lecture.title = title.trim();
    }

    if (videoURL !== undefined) {
      lecture.videoURL = videoURL.trim();
    }

    if (noteTitle !== undefined) {
      lecture.noteTitle = noteTitle;
    }

    /* ================= SAVE ================= */

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error in updateLecture:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const addSection = async (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return res
      .status(400)
      .json({ message: "Course not found while creating section" });
  }

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const section = await Section.create({
    title,
    courseId,
  });

  course.sections.push(section._id);
  await course.save();

  res.status(200).json({
    success: true,
    section,
  });
};

const updateSection = async (req, res) => {
  const { sectionId } = req.params;
  const { title } = req.body;

  if (!sectionId) {
    return res.status(400).json({
      success: false,
      message: "Section ID is required",
    });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  try {
    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // update
    section.title = title.trim();

    await section.save();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    console.error("Error updating section:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSection = async (req, res) => {
  const { sectionId } = req.params;

  if (!sectionId) {
    return res.status(400).json({
      success: false,
      message: "Section ID required",
    });
  }

  try {
    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    /* ================= PREVENT DELETE ================= */

    if (section.lectures && section.lectures.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete section. Please delete all lectures inside this section first.",
      });
    }

    /* ================= REMOVE FROM COURSE ================= */

    await Course.findByIdAndUpdate(section.courseId, {
      $pull: { sections: section._id },
    });

    /* ================= DELETE SECTION ================= */

    await section.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Delete section error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const { lectureId, sectionId } = req.params;

    /* ================= VALIDATION ================= */

    if (!lectureId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "lectureId and sectionId are required",
      });
    }

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    /* ================= REMOVE FROM SECTION ================= */

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    section.lectures.pull(lecture._id);
    await section.save();

    /* ================= DELETE NOTE (NON-BLOCKING) ================= */

    if (lecture.noteURL) {
      try {
        await deleteFromCloudinary(lecture.noteURL);
      } catch (err) {
        console.error("Error deleting lecture note:", err);
        // don't break execution
      }
    }

    /* ================= DELETE LECTURE ================= */

    await lecture.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteLecture:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


export const getCourseDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID",
    });
  }

  try {
    const course = await Course.findById(id).select("-sections -__v");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getCourseById = async (req, res) => {
  const { courseId } = req.params;

  // validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID",
    });
  }

  try {
    const course = await Course.findOne({
      _id: courseId,
      isArchived: false, // only active courses
    }).select("-sections -whatsappLink -__v"); // remove sections

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addLectureToASection = async (req, res) => {
  const { sectionId, lectureId } = req.body;

  const existedSection = await Section.findById(sectionId);

  if (!existedSection) {
    throw new ApiError(400, "section doesn't exist with this id");
  }

  const updatedSection = await Section.findByIdAndUpdate(
    sectionId,
    { $push: { lectures: lectureId } },
    { new: true },
  );

  res.status(200).json({
    message: "section updated",
    updatedSection,
  });
};

const addNewCourse = async (req, res) => {
  try {
    const { name, price, sections } = req.body;

    const sectionIds = [];

    for (const sec of sections) {
      const lectureIds = [];

      for (const lec of sec.lectures) {
        const newLecture = await Lecture.create({
          title: lec.title,
          videoURL: lec.videoURL,
          noteTitle: lec.noteTitle,
          noteURL: lec.noteURL,
        });
        lectureIds.push(newLecture._id);
      }

      const newSection = await Section.create({
        title: sec.title,
        lectures: lectureIds,
      });

      sectionIds.push(newSection._id);
    }

    const newCourse = await Course.create({
      name,
      price,
      section: sectionIds,
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
};

const getFullCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId)
      .populate({
        path: "sections",
        populate: {
          path: "lectures",
        },
      })
      .lean();

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getEnrolledCourses = async (req, res) => {
  const { courseIds } = req.body;
  const courses = await Course.find({ _id: { $in: courseIds } }).select(
    "_id courseTitle",
  );
  res.json({ courses });
};

const getAllSections = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId)
      .populate({
        path: "sections",
      })
      .lean();

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const sections = course.sections;
    return res.status(200).json({ success: true, sections });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateCourse = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "courseId is required",
    });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const {
      cardTitle,
      subTitle,
      courseTag,
      category,
      university,
      tags,
      mode,
      language,
      actualPrice,
      discountedPrice,
      courseTitle,
      courseDescription,
      whatsappLink,
      isFeatured,
      syllabusUrl,
    } = req.body;

    /* ================= IMAGE HANDLING ================= */

    if (req.files?.courseImage?.[0]?.path) {
      const uploadedImage = await uploadOnCloudinary(
        req.files.courseImage[0].path,
      );

      if (!uploadedImage?.secure_url) {
        return res.status(400).json({
          success: false,
          message: "Error while uploading the course image",
        });
      }

      // delete old image (non-blocking)
      if (course.courseImage) {
        try {
          await deleteFromCloudinary(course.courseImage);
        } catch (error) {
          console.error("Error deleting old course image:", error);
        }
      }

      course.courseImage = uploadedImage.secure_url;
    }

    /* ================= FIELD UPDATES ================= */

    if (cardTitle !== undefined)
      course.cardTitle = cardTitle || course.courseTitle;

    if (subTitle !== undefined) course.subTitle = subTitle;

    if (courseTag !== undefined) course.courseTag = courseTag;

    if (category !== undefined) course.category = category;

    //  important logic
    if (category === "semester_course") {
      const finalUniversity = university ?? course.university;

      if (!finalUniversity) {
        return res.status(400).json({
          success: false,
          message: "University is required for semester courses",
        });
      }

      course.university = normalizeUniversity(finalUniversity.trim());
    } else if (category !== undefined) {
      course.university = null;
    }

    if (mode !== undefined) course.mode = mode;

    if (language !== undefined) course.language = language;

    if (actualPrice !== undefined) course.actualPrice = Number(actualPrice);

    if (discountedPrice !== undefined)
      course.discountedPrice = Number(discountedPrice);

    if (courseTitle !== undefined) course.courseTitle = courseTitle;

    if (courseDescription !== undefined)
      course.courseDescription = courseDescription;

    if (whatsappLink !== undefined) course.whatsappLink = whatsappLink;

    if (isFeatured !== undefined) {
      course.isFeatured = String(isFeatured) === "true";
    }

      if (syllabusUrl !== undefined) course.syllabusUrl = syllabusUrl || null;

    /* ================= TAG CLEANING ================= */

    if (tags !== undefined) {
      let parsedTags = [];

      try {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

        if (!Array.isArray(parsedTags)) {
          throw new Error("Invalid format");
        }

        course.tags = [
          ...new Set(
            parsedTags.map((t) => t.toLowerCase().trim()).filter(Boolean),
          ),
        ];
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid tags format",
        });
      }
    }

    /* ================= SAVE ================= */

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the course",
    });
  }
};

const getSectionsWithLectures = async (req, res) => {
  const { courseId } = req.params;

  try {
    /* ================= COURSE ================= */

    const course = await Course.findById(courseId)
      .select("courseTitle subTitle courseImage actualPrice discountedPrice")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    /* ================= SECTIONS ================= */

    const sections = await Section.find({ courseId })
      .sort({ createdAt: 1 })
      .lean();

    /* ================= LECTURES ================= */

    const data = await Promise.all(
      sections.map(async (sec) => {
        const lectures = await Lecture.find({
          _id: { $in: sec.lectures },
        }).select("title videoURL noteTitle noteURL"); // keep it light

        return {
          ...sec,
          lectures,
        };
      }),
    );

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      course,
      sections: data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Error fetching sections",
    });
  }
};

const toggleCourseArchive = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // TOGGLE
    course.isArchived = !course.isArchived;

    await course.save();

    return res.status(200).json({
      success: true,
      message: course.isArchived
        ? "Course archived successfully"
        : "Course unarchived successfully",
      course,
    });
  } catch (error) {
    console.error("Toggle archive error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update archive status",
    });
  }
};

const clearCourseEnrollments = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /* ================= VALIDATE COURSE ================= */

    const course = await Course.findById(courseId).session(session);

    if (!course) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    /* ================= DELETE ENROLLMENTS ================= */

    const enrollmentResult = await CourseEnrollment.deleteMany(
      { courseId },
      { session },
    );

    /* ================= UPDATE USERS ================= */

    // Step 1: pull course from all users
    const userResult = await User.updateMany(
      { enrolledCourses: courseId },
      {
        $pull: { enrolledCourses: courseId },
      },
      { session },
    );

    // Step 2: set isPremiumMember = false ONLY if no courses left
    const premiumUpdateResult = await User.updateMany(
      {
        enrolledCourses: { $size: 0 },
        isPremiumMember: true,
      },
      {
        $set: { isPremiumMember: false },
      },
      { session },
    );

    /* ================= DELETE MONTHLY FEES ================= */

    const feeResult = await MonthlyFee.deleteMany({ courseId }, { session });

    /* ================= COMMIT ================= */

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Enrollments cleared successfully",
      stats: {
        enrollmentsDeleted: enrollmentResult.deletedCount,
        usersUpdated: userResult.modifiedCount,
        premiumRevoked: premiumUpdateResult.modifiedCount,
        feesDeleted: feeResult.deletedCount,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Clear enrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear enrollments",
    });
  }
};


export const addBook = async (req, res) => {
  const { courseId } = req.params;
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({
      success: false,
      message: "Title and URL are required",
    });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.books.push({ title, url });

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Book added successfully",
      books: course.books,
    });
  } catch (error) {
    console.error("Add book error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add book",
    });
  }
};


export const updateBook = async (req, res) => {
  const { courseId, bookIndex } = req.params;
  const { title, url } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course || !course.books[bookIndex]) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (title !== undefined) course.books[bookIndex].title = title;
    if (url !== undefined) course.books[bookIndex].url = url;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      books: course.books,
    });
  } catch (error) {
    console.error("Update book error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};


export const deleteBook = async (req, res) => {
  const { courseId, bookIndex } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course || !course.books[bookIndex]) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    course.books.splice(bookIndex, 1);

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      books: course.books,
    });
  } catch (error) {
    console.error("Delete book error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};

export {
  createCourse,
  getAllCourses,
  addSection,
  updateSection,
  addLecture,
  updateLecture,
  deleteLecture,
  addLectureToASection,
  addNewCourse,
  getFullCourse,
  getEnrolledCourses,
  getAllSections,
  updateCourse,
  deleteSection,
  getSectionsWithLectures,
  toggleCourseArchive,
  clearCourseEnrollments,
};
