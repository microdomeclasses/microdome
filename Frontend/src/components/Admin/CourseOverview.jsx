import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router";
import {
  Users,
  Pencil,
  Settings,
  ExternalLink,
  Plus,
  Layers,
  Trash2,
  Video,
  Loader2,
  File,
  FileText
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CourseOverview = () => {
  const { courseId } = useParams();

  const user = useSelector((state) => state.auth?.userData);

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [bookModal, setBookModal] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [bookUrl, setBookUrl] = useState("");
  const [editingBookIndex, setEditingBookIndex] = useState(null);
  const [bookLoading, setBookLoading] = useState(false);
  const [deleteBookIndex, setDeleteBookIndex] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [courseRes, sectionRes] = await Promise.all([
          axios.get(`${ApiUrl}/courses/get-course-details/${courseId}`, {
            withCredentials: true,
          }),
          axios.get(`${ApiUrl}/courses/get-all-sections/${courseId}`, {
            withCredentials: true,
          }),
        ]);

        setCourse(courseRes.data.course);
        setSections(sectionRes.data.sections || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleSubmitSection = async (e) => {
    e.preventDefault();

    if (!sectionTitle.trim()) {
      toast.error("Section title required");
      return;
    }

    try {
      setCreating(true);

      let res;

      if (editingSection) {
        // UPDATE
        res = await axios.patch(
          `${ApiUrl}/courses/sections/${editingSection._id}`,
          { title: sectionTitle },
          { withCredentials: true },
        );

        setSections((prev) =>
          prev.map((s) =>
            s._id === editingSection._id ? res.data.section : s,
          ),
        );

        toast.success("Section updated");
      } else {
        // CREATE
        res = await axios.post(
          `${ApiUrl}/courses/${courseId}/sections`,
          { title: sectionTitle },
          { withCredentials: true },
        );

        setSections((prev) => [...prev, res.data.section]);

        toast.success("Section added");
      }

      // reset
      setSectionTitle("");
      setEditingSection(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setCreating(false);
    }
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionTitle(section.title);
    setShowModal(true);
  };

  const handleDeleteSection = async () => {
    if (!deleteModal) return;

    try {
      setDeleting(true);

      await axios.delete(`${ApiUrl}/courses/sections/${deleteModal._id}`, {
        withCredentials: true,
      });

      setSections((prev) => prev.filter((s) => s._id !== deleteModal._id));

      toast.success("Section deleted");
      setDeleteModal(null);
    } catch (err) {
      console.error(err);

      const message = err.response?.data?.message || "Failed to delete section";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditBook = (book, index) => {
    setEditingBookIndex(index);
    setBookTitle(book.title);
    setBookUrl(book.url);
    setBookModal(true);
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();

    if (!bookTitle.trim() || !bookUrl.trim()) {
      toast.error("Title and URL required");
      return;
    }

    try {
      setBookLoading(true);

      let res;

      if (editingBookIndex !== null) {
        // UPDATE
        res = await axios.put(
          `${ApiUrl}/courses/${courseId}/books/${editingBookIndex}`,
          {
            title: bookTitle,
            url: bookUrl,
          },
          { withCredentials: true },
        );

        toast.success("Book updated");
      } else {
        // CREATE
        res = await axios.post(
          `${ApiUrl}/courses/${courseId}/books`,
          {
            title: bookTitle,
            url: bookUrl,
          },
          { withCredentials: true },
        );

        toast.success("Book added");
      }

      // update course state
      setCourse((prev) => ({
        ...prev,
        books: res.data.books,
      }));

      // reset
      setBookModal(false);
      setBookTitle("");
      setBookUrl("");
      setEditingBookIndex(null);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setBookLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    if (deleteBookIndex === null) return;

    try {
      setDeleteLoading(true);

      const res = await axios.delete(
        `${ApiUrl}/courses/${courseId}/books/${deleteBookIndex}`,
        { withCredentials: true },
      );

      // update UI
      setCourse((prev) => ({
        ...prev,
        books: res.data.books,
      }));

      toast.success("Book deleted");
      setDeleteBookIndex(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete book");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-60 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-40 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Toaster position="top-right" />
      {/* HERO */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col lg:flex-row gap-6 shadow-sm">
        {/* Image */}
        <img
          src={course.courseImage}
          className="h-52 w-full lg:w-[280px] object-cover rounded-lg"
        />

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Info */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {course.courseTitle}
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              {course.subTitle}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {course.courseDescription}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-400 line-through">
                ₹{course.actualPrice}
              </span>
              <span className="text-xl font-semibold text-green-600">
                ₹{course.discountedPrice}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2 mt-4">
            {/* PRIMARY */}
            {user?.role === "admin" && (
              <Link
                to={`/admin/courses/${courseId}/edit`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600"
              >
                <Pencil className="w-4 h-4" />
                Edit Course
              </Link>
            )}

            {/* SECONDARY */}
            <Link
              to={`/admin/courses/${courseId}/enrollments`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500 text-green-600 text-sm hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Users className="w-4 h-4" />
              Students
            </Link>

            <Link
              to={`/my-courses/${courseId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500 text-purple-600 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <ExternalLink className="w-4 h-4" />
              View Course
            </Link>

            {/* TERTIARY */}
            {user?.role === "admin" && (
              <Link
                to={`/admin/courses/${courseId}/settings`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500/80 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sections
          </h2>

          <div className="flex gap-3">
            <Link
              to={`/admin/courses/${courseId}/sections`}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Layers className="w-4 h-4" />
              Manage Sections
            </Link>

            <button
              onClick={() => {
                setEditingSection(null);
                setSectionTitle("");
                setShowModal(true);
              }}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>
        </div>

        {/* Sections List */}
        {sections.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No sections added yet.
          </p>
        ) : (
          <div className="space-y-3">
            {sections.map((sec, index) => (
              <div
                key={sec._id}
                className="flex justify-between items-center
             px-4 py-3 rounded-xl
             bg-gray-50 dark:bg-zinc-800
             border border-gray-200 dark:border-zinc-700"
              >
                {/* LEFT */}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {"Section "} {index + 1}: {sec.title}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Video className="w-3.5 h-3.5 inline-block" />
                    {sec.lectures?.length || 0} lectures
                  </span>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-2">
                  {/* EDIT */}
                  <button
                    onClick={() => handleEditSection(sec)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700
               bg-white dark:bg-zinc-800
               hover:bg-blue-50 dark:hover:bg-blue-900/20
               transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => setDeleteModal(sec)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700
             bg-white dark:bg-zinc-800
             hover:bg-red-50 dark:hover:bg-red-900/20
             transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKS */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Books / Study Materials
          </h2>

          {/* Add Book */}
          <button
            onClick={() => {
              setEditingBookIndex(null);
              setBookTitle("");
              setBookUrl("");
              setBookModal(true);
            }}
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        </div>

        {/* CONTENT */}
        {!course.books || course.books.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No books added for this course.
          </p>
        ) : (
          <div className="space-y-3">
            {course.books.map((book, index) => (
              <div
                key={index}
                className="flex justify-between items-center
          px-4 py-3 rounded-xl
          bg-gray-50 dark:bg-zinc-800
          border border-gray-200 dark:border-zinc-700"
              >
                {/* LEFT */}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {book.title}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <FileText className="w-3.5 h-3.5" />
                    PDF / External Resource
                  </span>
                </div>

                {/* RIGHT ACTION */}
                <div className="flex items-center gap-2">
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm
            bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View
                  </a>
                  {/* Edit */}
                  <button
                    onClick={() => handleEditBook(book, index)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700
               bg-white dark:bg-zinc-800
               hover:bg-blue-50 dark:hover:bg-blue-900/20
               transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => setDeleteBookIndex(index)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700
  bg-white dark:bg-zinc-800
  hover:bg-red-50 dark:hover:bg-red-900/20
  transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editingSection ? "Edit Section" : "Add Section"}
            </h2>

            <form onSubmit={handleSubmitSection} className="space-y-4">
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Section title"
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded px-3 py-2 text-gray-800 dark:text-white"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSection(null);
                    setSectionTitle("");
                  }}
                  className="px-4 py-2 rounded border border-gray-300 dark:border-zinc-700
                     hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  {creating
                    ? editingSection
                      ? "Updating..."
                      : "Creating..."
                    : editingSection
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Delete Section?
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              This will delete all lectures inside this section. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="px-4 py-2 rounded border border-gray-300 dark:border-zinc-700
                     hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteSection}
                disabled={deleting}
                className="px-4 py-2 flex items-center gap-2 rounded bg-red-600 text-white hover:bg-red-700
                     cursor-pointer disabled:opacity-70"
              >
                {deleting && (
                  <Loader2 className="w-4 h-4 text-white inline-block ml-2 animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {bookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editingBookIndex !== null ? "Edit Book" : "Add Book"}
            </h2>

            <form onSubmit={handleSubmitBook} className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  Book Title
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g. Ananthanarayan and Paniker's Textbook of Microbiology"
                  className="w-full mt-1 border border-gray-300 dark:border-zinc-700
            bg-white dark:bg-zinc-800 rounded px-3 py-2 text-gray-800 dark:text-white"
                />
              </div>

              {/* URL */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  Book URL
                </label>
                <input
                  type="text"
                  value={bookUrl}
                  onChange={(e) => setBookUrl(e.target.value)}
                  placeholder="https://your-storage.com/book.pdf"
                  className="w-full mt-1 border border-gray-300 dark:border-zinc-700
            bg-white dark:bg-zinc-800 rounded px-3 py-2 text-gray-800 dark:text-white"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setBookModal(false);
                    setEditingBookIndex(null);
                    setBookTitle("");
                    setBookUrl("");
                  }}
                  className="px-4 py-2 rounded border border-gray-300 dark:border-zinc-700
            hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bookLoading}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700
            disabled:opacity-50 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {bookLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBookIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteBookIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 
    rounded-xl w-full max-w-sm p-6 shadow-lg"
          >
            {/* TITLE */}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Delete Book
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteBookIndex(null)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-zinc-700
          hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteBook}
                disabled={deleteLoading}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white
          disabled:opacity-50 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseOverview;
