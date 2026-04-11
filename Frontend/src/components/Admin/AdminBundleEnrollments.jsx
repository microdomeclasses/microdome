import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Users, Layers } from "lucide-react";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminBundleEnrollments = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${ApiUrl}/admin/mock-test-bundles/enrollments`,
        { withCredentials: true }
      );

      setBundles(res.data.bundles || []);
    } catch (e) {
      toast.error("Failed to load bundle stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (bundles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Layers className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          No Bundle Enrollments Yet
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          No students have enrolled in any mock test bundle yet.
        </p>
      </div>
    );
  }

  /* ================= PAGE ================= */

  return (
    <div className="w-full py-4">
      <Toaster position="top-right" />

      {/* HEADER */}
      <header className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
          Bundle Enrollments
        </h1>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Bundles: {bundles.length}
        </div>
      </header>

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((b) => (
          <div
            key={b.bundleId}
            className="group rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800
                       bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg
                       transition-all duration-300"
          >
            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={b.thumbnail}
                alt={b.title}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                {b.title}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {b.description}
              </p>

              {/* STATUS + COUNT */}
              <div className="flex justify-between items-center mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded font-semibold ${
                    b.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {b.isActive ? "ACTIVE" : "INACTIVE"}
                </span>

                <span className="flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300 px-2 py-1 bg-blue-50 dark:bg-blue-900/40 rounded">
                  <Users className="w-4 h-4" />
                  {b.enrolledCount}
                </span>
              </div>

              {/* CTA */}
              <Link
                to={`/admin/bundles/${b.bundleId}/students`}
                className="mt-auto text-center py-2 rounded-lg font-medium
                           bg-blue-600 text-white hover:bg-blue-700
                           dark:bg-blue-500 dark:hover:bg-blue-600
                           transition-all"
              >
                View Students
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBundleEnrollments;