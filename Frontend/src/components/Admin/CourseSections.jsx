import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import {
  ChevronDown,
  Video,
  FileText,
  Pencil,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const SectionsPage = () => {
  const { courseId } = useParams();

  const [sections, setSections] = useState([]);
  const [course, setCourse] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  const [lectureModal, setLectureModal] = useState(null); // section
  const [lectureForm, setLectureForm] = useState({
    title: "",
    videoURL: "",
    noteTitle: "",
    noteURL: null,
  });
  const [addingLecture, setAddingLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [deleteLectureModal, setDeleteLectureModal] = useState(null);

  const [deletingLecture, setDeletingLecture] = useState(false);
  const [previewLecture, setPreviewLecture] = useState(null);

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // youtube watch → embed
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtu.be short link
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // fallback (in case already embed or direct mp4)
    return url;
  };

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${ApiUrl}/courses/${courseId}/sections-with-lectures`,
        { withCredentials: true },
      );

      setSections(res.data.sections || []);
      setCourse(res.data.course || null); // 🔥 THIS WAS MISSING
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  /* ================= TOGGLE ================= */

  const toggleSection = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ================= ADD LECTURE ================= */

  const handleOpenLectureModal = (section) => {
    setLectureModal(section);
    setEditingLecture(null);
    setLectureForm({
      title: "",
      videoURL: "",
      noteTitle: "",
      noteURL: null,
    });
  };

  const handleLectureChange = (e) => {
    const { name, value, files } = e.target;

    setLectureForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();

    try {
      setAddingLecture(true);

      const data = new FormData();
      data.append("title", lectureForm.title);
      data.append("videoURL", lectureForm.videoURL);
      data.append("noteTitle", lectureForm.noteTitle);

      if (lectureForm.noteURL) {
        data.append("noteURL", lectureForm.noteURL);
      }

      let res;

      if (editingLecture) {
        // EDIT MODE
        res = await axios.patch(
          `${ApiUrl}/courses/lectures/${editingLecture._id}`,
          data,
          { withCredentials: true },
        );

        // update UI
        setSections((prev) =>
          prev.map((sec) =>
            sec._id === lectureModal._id
              ? {
                  ...sec,
                  lectures: sec.lectures.map((l) =>
                    l._id === editingLecture._id ? res.data.lecture : l,
                  ),
                }
              : sec,
          ),
        );

        toast.success("Lecture updated");
      } else {
        // CREATE MODE
        res = await axios.post(
          `${ApiUrl}/courses/sections/${lectureModal._id}/lectures`,
          data,
          { withCredentials: true },
        );

        setSections((prev) =>
          prev.map((sec) =>
            sec._id === lectureModal._id
              ? {
                  ...sec,
                  lectures: [...sec.lectures, res.data.lecture],
                }
              : sec,
          ),
        );

        toast.success("Lecture added");
      }

      // reset
      setLectureModal(null);
      setEditingLecture(null);
      setLectureForm({
        title: "",
        videoURL: "",
        noteTitle: "",
        noteURL: null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setAddingLecture(false);
    }
  };

  /* ================= DELETE LECTURE ================= */

  const handleDeleteLecture = async () => {
    if (!deleteLectureModal) return;

    const { lecture, sectionId } = deleteLectureModal;

    try {
      setDeletingLecture(true);

      await axios.delete(
        `${ApiUrl}/courses/sections/${sectionId}/lectures/${lecture._id}`,
        { withCredentials: true },
      );

      // update UI
      setSections((prev) =>
        prev.map((sec) =>
          sec._id === sectionId
            ? {
                ...sec,
                lectures: sec.lectures.filter((l) => l._id !== lecture._id),
              }
            : sec,
        ),
      );

      toast.success("Lecture deleted");
      setDeleteLectureModal(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lecture");
    } finally {
      setDeletingLecture(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 animate-pulse">
        {/* COURSE TITLE */}
        <div className="space-y-2">
          <div className="h-7 w-64 bg-gray-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>

        {/* HEADER */}
        <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />

        {/* SECTIONS */}
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl"
          >
            {/* SECTION HEADER */}
            <div className="flex justify-between items-center py-4 px-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-800 rounded" />

                <div className="flex flex-col gap-2">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>

              <div className="h-9 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
            </div>

            {/* LECTURES */}
            <div className="px-6 pb-4 space-y-2">
              {[1, 2].map((_, j) => (
                <div
                  key={j}
                  className="flex justify-between items-center p-3 rounded-lg
                           bg-gray-100 dark:bg-zinc-800
                           border border-gray-200 dark:border-zinc-700"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-700 rounded" />
                  </div>

                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Toaster position="top-right" />
      {/* COURSE TITLE & SUBTITLE */}
      {course && (
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {course.courseTitle}
          </h1>

          {course.subTitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {course.subTitle}
            </p>
          )}
        </div>
      )}
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Sections & Lectures
        </h1>
      </div>

      {/* SECTIONS */}

      {sections.length === 0 ? (
        <p className="text-gray-500 text-sm text-left">No sections found.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((sec, index) => (
            <div
              key={sec._id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl"
            >
              {/* SECTION HEADER */}
              <div
                className="flex justify-between items-center py-4 px-6 cursor-pointer"
                onClick={() => toggleSection(sec._id)}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`w-5 h-5 transition text-black dark:text-white ${
                      expanded[sec._id] ? "rotate-180" : ""
                    }`}
                  />

                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      Section {index + 1}: {sec.title}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Video className="w-3.5 h-3.5 inline-block" />
                      {sec.lectures.length || 0} Lectures
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLectureModal(sec);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer text-sm"
                  >
                    <Video className="w-4 h-4" />
                    Add Lecture
                  </button>
                </div>
              </div>

              {/* LECTURES */}
              {expanded[sec._id] && (
                <div className="px-6 pb-4 space-y-2">
                  {sec.lectures.length === 0 ? (
                    <p className="text-sm text-gray-500">No lectures yet</p>
                  ) : (
                    sec.lectures.map((lec, i) => (
                      <div
                        key={lec._id}
                        className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-zinc-800
             border border-gray-200 dark:border-zinc-700"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {i + 1}. {lec.title}
                          </span>

                          {lec.noteURL && (
                            <a
                              href={lec.noteURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5 inline-block ml-3.5" />
                              View Notes
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* PREVIEW */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewLecture(lec);
                            }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700
             bg-white dark:bg-zinc-800
             hover:bg-gray-100 dark:hover:bg-zinc-700
             transition cursor-pointer"
                          >
                            <Video className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          </button>
                          {/* EDIT */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setLectureModal(sec); // keep section
                              setEditingLecture(lec);

                              setLectureForm({
                                title: lec.title || "",
                                videoURL: lec.videoURL || "",
                                noteTitle: lec.noteTitle || "",
                                noteURL: null, // file can't be prefilled
                              });
                            }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700
               bg-white dark:bg-zinc-800
               hover:bg-blue-50 dark:hover:bg-blue-900/20
               transition cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteLectureModal({
                                lecture: lec,
                                sectionId: sec._id,
                              });
                            }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700
             bg-white dark:bg-zinc-800
             hover:bg-red-50 dark:hover:bg-red-900/20
             transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {lectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editingLecture ? "Edit Lecture" : "Add Lecture"} →{" "}
              {lectureModal.title}
            </h2>

            <form onSubmit={handleAddLecture} className="space-y-4">
              {/* TITLE */}
              <input
                name="title"
                placeholder="Lecture Title"
                value={lectureForm.title}
                onChange={handleLectureChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700
                   bg-white dark:bg-zinc-800
                   text-gray-800 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />

              {/* VIDEO URL */}
              <input
                name="videoURL"
                placeholder="Video URL"
                value={lectureForm.videoURL}
                onChange={handleLectureChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700
                   bg-white dark:bg-zinc-800
                   text-gray-800 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />

              {/* NOTE TITLE */}
              <input
                name="noteTitle"
                placeholder="Note Title (Optional)"
                value={lectureForm.noteTitle}
                onChange={handleLectureChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700
                   bg-white dark:bg-zinc-800
                   text-gray-800 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              {/* FILE */}
              <input
                type="file"
                name="noteURL"
                onChange={handleLectureChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm text-gray-600 dark:text-gray-300
                bg-white dark:bg-zinc-800
                   file:mr-3 file:px-3 file:py-1.5
                   file:rounded-md file:border-0
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700 cursor-pointer
                   file:cursor-pointer"
              />

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">
                {/* CANCEL */}
                <button
                  type="button"
                  onClick={() => setLectureModal(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700
                     bg-gray-100 dark:bg-zinc-800
                     text-gray-700 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-zinc-700
                     transition cursor-pointer"
                >
                  Cancel
                </button>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={addingLecture}
                  className={`px-5 py-1.5 rounded-lg text-white transition
            ${
              addingLecture
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
                >
                  {addingLecture
                    ? editingLecture
                      ? "Updating..."
                      : "Adding..."
                    : editingLecture
                      ? "Update"
                      : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteLectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Delete Lecture?
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              This will permanently delete this lecture and its notes. This
              action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              {/* CANCEL */}
              <button
                onClick={() => setDeleteLectureModal(null)}
                disabled={deletingLecture}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700
                     hover:bg-gray-100 dark:hover:bg-zinc-800
                     cursor-pointer disabled:opacity-70 text-black dark:text-white"
              >
                Cancel
              </button>

              {/* DELETE */}
              <button
                onClick={handleDeleteLecture}
                disabled={deletingLecture}
                className="px-4 py-2 rounded-lg bg-red-600 text-white
                     hover:bg-red-700 cursor-pointer
                     disabled:opacity-70 flex items-center gap-2"
              >
                {deletingLecture && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-4xl">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setPreviewLecture(null)}
              className="absolute -top-10 right-0 text-white text-sm cursor-pointer p-1 rounded bg-zinc-800 hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* VIDEO */}
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <iframe
                src={getEmbedUrl(previewLecture.videoURL)}
                title="Lecture Preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* TITLE */}
            <p className="text-white mt-3 text-base font-medium">{previewLecture.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionsPage;
