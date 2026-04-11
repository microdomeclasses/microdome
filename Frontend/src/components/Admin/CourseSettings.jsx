import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { Trash2, Eraser, Archive, ArchiveRestore, ExternalLink } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CourseSettings = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth?.userData);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [archiveModal, setArchiveModal] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  /* ================= ADMIN PROTECTION ================= */

  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied");
      navigate("/");
    }
  }, [user]);

  /* ================= FETCH ================= */

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${ApiUrl}/courses/get-course-details/${courseId}`,
        { withCredentials: true },
      );

      setCourse(res.data.course);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  /* ================= HANDLERS ================= */

  const handleClearEnrollments = async () => {
    try {
      setClearing(true);

      const res = await axios.delete(
        `${ApiUrl}/courses/${courseId}/clear-enrollments`,
        { withCredentials: true },
      );

      toast.success("Enrollments cleared");

      setShowClearModal(false);

      console.log(res.data.stats); // optional → show later
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setClearing(false);
    }
  };

  /* ================= ARCHIVE COURSE ================= */

  const handleToggleArchive = async () => {
    try {
      setArchiving(true);

      const res = await axios.patch(
        `${ApiUrl}/courses/${courseId}/archive`,
        {},
        { withCredentials: true },
      );

      setCourse(res.data.course);
      toast.success(res.data.message);

      setArchiveModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setArchiving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>
    );
  }

  /* ================= PAGE ================= */

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage course configuration and administrative actions
        </p>
      </div>

      {/* ================= COURSE INFO ================= */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Course Info
        </h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Title:{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {course?.courseTitle}
            </span>
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mode:{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {course?.mode.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      {/* ================= MANAGEMENT ================= */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Management
        </h2>

        {/* CLEAR ENROLLMENTS */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-800 dark:text-white">
              Clear Enrollments
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Remove all students from this course
            </p>
          </div>

          <button
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
          >
            <Eraser className="w-4 h-4 inline-block" />
            Clear
          </button>
        </div>

        {/* MONTHLY FEE SHEET */}
        {course?.mode?.toLowerCase() === "live" && (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                Monthly Fee Sheet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage student monthly payments
              </p>
            </div>

            <Link
              to={`/admin/courses/${courseId}/fees`}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 inline-block" />
              Open
            </Link>
          </div>
        )}

        {/* ARCHIVE */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-800 dark:text-white">
              {course?.isArchived ? "Unarchive Course" : "Archive Course"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {course?.isArchived
                ? "Make course visible again"
                : "Hide course from users"}
            </p>
          </div>

          <button
            onClick={() => setArchiveModal(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-800 dark:bg-zinc-700 
             hover:bg-gray-900 dark:hover:bg-zinc-600 
             text-white cursor-pointer"
          >
            {course?.isArchived ? (
              <ArchiveRestore className="w-4 h-4 inline-block" />
            ) : (
              <Archive className="w-4 h-4 inline-block" />
            )}
            {course?.isArchived ? "Unarchive" : "Archive"}
          </button>
        </div>
      </div>

      {/* ================= DANGER ZONE ================= */}
      <div className="border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>

        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-red-600">Delete Course</p>
            <p className="text-sm text-red-500">
              Permanently delete this course and all related data
            </p>
          </div>

          <button
            onClick={() => toast.error("Course deletion is disabled for now")}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            <Trash2 className="w-4 h-4 inline-block" />
            Delete
          </button>
        </div>
      </div>

      {archiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {course?.isArchived ? "Unarchive Course?" : "Archive Course?"}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {course?.isArchived
                ? "This will make the course visible to users again."
                : "This will hide the course from users. Existing enrollments remain but access is blocked."}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              {/* CANCEL */}
              <button
                onClick={() => setArchiveModal(false)}
                disabled={archiving}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700
                     hover:bg-gray-100 dark:hover:bg-zinc-800
                     cursor-pointer disabled:opacity-70 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>

              {/* CONFIRM */}
              <button
                onClick={handleToggleArchive}
                disabled={archiving}
                className="px-4 py-2 rounded-lg bg-gray-800 dark:bg-zinc-700 
                     hover:bg-gray-900 dark:hover:bg-zinc-600
                     text-white cursor-pointer disabled:opacity-70"
              >
                {archiving
                  ? "Updating..."
                  : course?.isArchived
                    ? "Unarchive"
                    : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-5">
            {/* TITLE */}
            <div>
              <h2 className="text-lg font-semibold text-red-600">
                Clear Enrollments
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This will remove all students from this course.
              </p>
            </div>

            {/* WARNING */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600">
              ⚠️ This action is irreversible. All enrollments and fee data will
              be permanently deleted.
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                disabled={clearing}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleClearEnrollments}
                disabled={clearing}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clearing ? "Clearing..." : "Yes, Clear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSettings;
