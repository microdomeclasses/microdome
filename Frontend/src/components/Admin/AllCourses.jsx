import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Pencil, X, Search, Star, Archive } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const user = useSelector((state) => state.auth?.userData);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${ApiUrl}/admin/courses-with-user-counts`,
          {
            withCredentials: true,
          },
        );
        setCourses(res.data?.courses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.courseTitle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full py-4">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
          All Courses
        </h1>

        <div className="flex-1 max-w-md">
          <div className="relative w-full ">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-10 py-2.5 rounded-full border border-gray-300 dark:border-zinc-700
                 bg-white dark:bg-zinc-900
                 text-gray-800 dark:text-white
                 placeholder-gray-400 dark:placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition"
            />

            {/* SEARCH ICON */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>

            {/* CLEAR BUTTON */}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2
                   p-1 rounded-full
                   hover:bg-gray-200 dark:hover:bg-zinc-700
                   cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {user?.role === "admin" && (
          <Link
            to="/admin/courses/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                       bg-blue-600 text-white hover:bg-blue-700
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </Link>
        )}
      </header>

      {/* Search Bar */}

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {search ? "No matching courses found" : "No courses found"}
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800
             bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl
             transition-all duration-300"
            >
              {/* Edit Button */}
              {user?.role === "admin" && (
                <Link
                  to={`/admin/courses/${course._id}/edit`}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full
               bg-white/90 dark:bg-zinc-800/90 backdrop-blur
               shadow hover:scale-105 transition cursor-pointer"
                  title="Edit course"
                >
                  <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </Link>
              )}

              <div className="absolute top-3 left-3 z-20 flex gap-2 flex-wrap">
                {course.isFeatured && (
                  <span
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
      bg-yellow-500/90 text-white backdrop-blur shadow-sm"
                  >
                    <Star className="w-3 h-3" fill="currentColor" />
                    Featured
                  </span>
                )}

                {course.isArchived && (
                  <span
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
  bg-red-500/90 text-white backdrop-blur shadow-sm"
                  >
                    <Archive className="w-3 h-3" />
                    Archived
                  </span>
                )}
              </div>

              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={course.courseImage}
                  alt={course.courseTitle}
                  className="w-full aspect-video object-cover
                 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug">
                  {course.courseTitle}
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {course.subTitle}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-green-600 dark:text-green-400">
                    ₹{course.discountedPrice}
                  </span>

                  <span className="font-medium">
                    {course.studentCount || 0} students
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-zinc-800" />

                {/* CTA */}
                <Link
                  to={`/admin/courses/${course._id}`}
                  className="mt-2 text-center py-2 rounded-lg font-medium
                 bg-blue-600 hover:bg-blue-700
                 dark:bg-blue-500 dark:hover:bg-blue-600
                 text-white transition-all cursor-pointer"
                >
                  Manage Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
