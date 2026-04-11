import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import userImage from "../../assets/user-img.jpeg";
import { Link } from "react-router";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const PremiumUserDetails = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [courseName, setCourseName] = useState("Course Name");
  const [confirmUser, setConfirmUser] = useState(null);
  const [loading, setLoading] = useState(false)

  const user = useSelector((state) => state.auth?.userData);
  const role = user?.role;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const [isLiveCourse, setIsLiveCourse] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${ApiUrl}/admin/get-user-details/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success && res.data.users) {
          setUsers(
            res.data.users.map((u) => ({
              id: u.userId,
              name: u.name || "---",
              email: u.email || "---",
              profilePic: u?.profileImage || userImage,
              dateJoined: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "---",
              mobile: u?.mobileNumber || "---",
              instituteName: u?.instituteName || "---",
              presentCourseOfStudy: u?.presentCourseOfStudy || "---",
              access: u.isActive,
              currentMonthPaid: u.currentMonthPaid,
            }))
          );

          setCourseName(res.data.courseName || "---");

          const live =
            res.data.courseMode?.toLowerCase() === "live" &&
            !res.data.courseIsArchived;
          setIsLiveCourse(live);
        }
      })
      .catch(() => toast.error("Failed to load user details"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleAccess = async (userId, currentAccess) => {
    try {
      const endpoint = currentAccess
        ? "/admin/revoke-access"
        : "/admin/grant-access";

      const { data } = await axios.post(
        `${ApiUrl}${endpoint}`,
        { userId, courseId: id },
        { withCredentials: true }
      );

      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, access: !currentAccess } : u
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to update access");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading students...
        </p>
      </div>
    );
  }

  return (
    <div className="h-[90vh] flex flex-col bg-white dark:bg-gray-950 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">

      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800 gap-3">

        <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">
          {courseName} - {users.length} {users.length === 1 ? "Student" : "Students"}
        </h2>

        <div className="flex items-center gap-2">

          {role === "admin" && isLiveCourse && currentUsers.length > 0 && (
            <Link
              to={`/admin/courses/${id}/fees`}
              className="text-xs md:text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded"
            >
              Monthly Fee Sheet
            </Link>
          )}

          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="flex-1 overflow-auto scrollbar-none">

        <div className="overflow-x-auto">

          <table className="min-w-[800px] w-full border-collapse">

            <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">

              <tr className="text-left text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 text-sm md:text-base">

                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">Date Enrolled</th>
                <th className="px-4 py-2 text-center">Mobile</th>
                <th className="px-4 py-2 text-center">Institute Name</th>
                <th className="px-4 py-2 text-center">Present Course</th>
                <th className="px-4 py-2 text-center">Status</th>

              </tr>

            </thead>

            <tbody>

              {currentUsers.length > 0 ? (
                currentUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-xs md:text-sm"
                  >

                    {/* NAME */}

                    <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">

                      <img
                        src={u.profilePic}
                        alt={u.name}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full object-cover
                        ${
                          isLiveCourse
                            ? u.currentMonthPaid
                              ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 ring-green-500"
                              : "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 ring-red-500"
                            : ""
                        }`}
                      />

                      <div className="min-w-[150px]">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {u.name}
                        </p>
                        <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
                          {u.email}
                        </p>
                      </div>

                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {u.dateJoined}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {u.mobile}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {u.instituteName}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {u.presentCourseOfStudy}
                    </td>

                    {/* ACCESS */}

                    <td className="px-4 py-3 text-center">

                      {role === "admin" ? (

                        <label className="inline-flex items-center cursor-pointer">

                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={u.access}
                            onChange={() => setConfirmUser(u)}
                          />

                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ${
                              u.access
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          >

                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                                u.access ? "translate-x-5" : ""
                              }`}
                            />

                          </div>

                        </label>

                      ) : (

                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            u.access
                              ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                              : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {u.access ? "Active" : "Inactive"}
                        </span>

                      )}

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}

      {filteredUsers.length > usersPerPage && (

        <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200 dark:border-gray-800">

          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 dark:text-gray-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
              }`}
            >
              {i + 1}
            </button>

          ))}

          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 dark:text-gray-300 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>

        </div>

      )}

      {/* CONFIRM MODAL */}

      {role === "admin" && confirmUser && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-80 shadow-lg border border-gray-200 dark:border-gray-700">

            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Confirm Action
            </h3>

            <p className="mb-6 text-gray-600 dark:text-gray-400">

              Are you sure you want to{" "}

              {confirmUser.access ? (
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  revoke
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  grant
                </span>
              )}{" "}

              access for{" "}

              <span className="font-medium">
                {confirmUser.name}
              </span>

              ?

            </p>

            <div className="flex justify-end gap-3">

              <button
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setConfirmUser(null)}
              >
                No
              </button>

              <button
                className={`px-4 py-2 rounded text-white ${
                  confirmUser.access
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => {
                  toggleAccess(confirmUser.id, confirmUser.access);
                  setConfirmUser(null);
                }}
              >
                Yes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default PremiumUserDetails;