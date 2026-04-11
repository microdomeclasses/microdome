import { useState, useEffect } from "react";
import { Logo, CourseSection } from "../components";
import axios from "axios";
import { useParams, Link, useSearchParams } from "react-router";
import { Book, BookIcon, BookOpen, TriangleAlert } from "lucide-react";
import { useSelector } from "react-redux";
import CourseVideoPlayer from "../components/CourseVideoPlayer";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CourseViewPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useSelector((state) => state.theme.theme);

  const [course, setCourse] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${ApiUrl}/courses/get-full-course/${id}`, {
          withCredentials: true,
        });

        const courseData = res.data.course;
        setCourse(courseData);

        const lectureIdFromUrl = searchParams.get("lecture");

        let foundLecture = null;
        let foundSection = null;

        for (const sec of courseData.sections) {
          for (const lec of sec.lectures) {
            if (lec._id === lectureIdFromUrl) {
              foundLecture = lec;
              foundSection = sec;
              break;
            }
          }
          if (foundLecture) break;
        }

        if (!foundLecture) {
          foundLecture = courseData?.sections?.[0]?.lectures?.[0] || null;
          foundSection = courseData?.sections?.[0] || null;
        }

        setCurrentLecture(foundLecture);
        setCurrentSection(foundSection);
      } catch (err) {
        console.error(err);

        // Proper error mapping
        if (err.response?.status === 401) {
          setError(err.response.data.message || "Unauthorized");
        } else if (err.response?.status === 404) {
          setError("Course not found");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  /* ================= VIDEO ID ================= */
  const getVideoId = (url) => {
    if (!url) return null;

    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/|embed\/)|youtu\.be\/)([^#&?]*)/;

    const match = url.match(regExp);

    return match && match[1] ? match[1] : null;
  };

  /* ================= HANDLE LECTURE SELECT ================= */
  const handleSelectLecture = (lecture, section) => {
    setCurrentLecture(lecture);
    setCurrentSection(section);

    // update URL
    setSearchParams({ lecture: lecture._id });
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div
        className={`w-full h-screen flex items-center justify-center bg-white dark:bg-black ${theme === "dark" ? "dark" : ""}`}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Dots Loader */}
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce"></span>
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:0.15s]"></span>
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:0.3s]"></span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div
        className={`w-full h-screen flex items-center justify-center bg-white dark:bg-black ${theme === "dark" ? "dark" : ""}`}
      >
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <TriangleAlert className="text-yellow-500 w-12 h-12" />

          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {error}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you think this is a mistake, contact support.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-gray-200 dark:border-zinc-800">
        <div className="px-4 md:px-6 py-3 flex items-center gap-3">
          <Link to="/">
            <Logo className="w-7 md:w-9" />
          </Link>

          <h1 className="text-lg md:text-xl font-semibold line-clamp-1">
            {course.courseTitle}
          </h1>
        </div>
      </div>

      {/* MAIN */}
      <div className="px-4 md:px-6 py-6 grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT */}
        <div className="space-y-3">
          <CourseVideoPlayer videoId={getVideoId(currentLecture?.videoURL)} />

          {/* TITLE */}
          <h2 className="text-lg md:text-xl font-semibold">
            {currentLecture?.title || "Select a lecture"}
          </h2>

          {/* CURRENT SECTION */}
          <p className="text-sm text-gray-500">
            {currentSection ? `Section: ${currentSection.title}` : ""}
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">Course Content</h2>

          {/* COURSE CONTENT */}
          <CourseSection
            sections={course.sections}
            currentLecture={currentLecture}
            onSelectLecture={(lecture, section) =>
              handleSelectLecture(lecture, section)
            }
          />

          {/* ================= BOOKS ================= */}
          {course?.books?.length > 0 && (
            <div className="mt-6 border-t border-gray-200 dark:border-zinc-800 pt-4">
              {/* HEADER */}
              <h3 className="text-sm flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <BookOpen className="w-4 h-4" />
                Books & Materials
              </h3>

              <div className="space-y-3">
                {course.books.map((book, index) => (
                  <a
                    key={index}
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-3 rounded-xl
          bg-white dark:bg-zinc-900
          border border-gray-200 dark:border-zinc-700
          hover:bg-gray-100 dark:hover:bg-zinc-800
          transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* LEFT */}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {book.title}
                        </span>

                        <span className="text-[11px] text-gray-500">
                          PDF / External Resource
                        </span>
                      </div>

                      {/* RIGHT */}
                      <span
                        className="text-xs px-2 py-1 rounded-md 
              bg-blue-100 text-blue-600 
              dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        View
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewPage;
