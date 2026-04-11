import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { CourseCard } from "..";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-zinc-900 rounded-xl p-4">
    <div className="aspect-video bg-gray-300 dark:bg-zinc-700 rounded-lg" />
    <div className="mt-3 h-4 bg-gray-300 dark:bg-zinc-700 rounded w-3/4" />
  </div>
);

const FeaturedCourses = ({ courses, loading }) => {
  const featuredCourses = courses || [];

  return (
    <section className="my-20 w-full flex justify-center">
      <div className="w-full max-w-6xl px-4">

        {/* HEADER */}
        <div className="text-center">
          <h4 className="text-sm text-gray-500 dark:text-gray-400">
            Courses
          </h4>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            Featured <span className="text-highlighted">Courses</span>
          </h2>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {Array(3).fill(0).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* COURSES GRID */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            to="/courses"
            className="flex items-center gap-2 px-6 py-3 rounded-lg
            bg-highlighted hover:bg-highlighted-hover
            text-white font-medium transition"
          >
            View All Courses
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;