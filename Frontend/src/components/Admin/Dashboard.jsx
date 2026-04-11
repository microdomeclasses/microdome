import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Crown, Book } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";
import userImage from "../../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalCourses: 0,
  });

  const roleStyles = {
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    instructor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    user: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  const [latestUsers, setLatestUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingStats(true);
        setLoadingUsers(true);

        const [usersRes, premiumRes, coursesRes, latestUsersRes] =
          await Promise.all([
            axios.get(`${ApiUrl}/admin/stats/users`, { withCredentials: true }),
            axios.get(`${ApiUrl}/admin/stats/premium-users`, {
              withCredentials: true,
            }),
            axios.get(`${ApiUrl}/admin/stats/courses`, {
              withCredentials: true,
            }),
            axios.get(`${ApiUrl}/admin/get-all-users?limit=5`, {
              withCredentials: true,
            }),
          ]);

        // ✅ Stats
        setStats({
          totalUsers: usersRes.data?.totalUsers ?? 0,
          premiumUsers: premiumRes.data?.premiumUsers ?? 0,
          totalCourses: coursesRes.data?.count ?? 0,
        });

        // ✅ Users
        if (latestUsersRes.data?.users) {
          setLatestUsers(
            latestUsersRes.data.users.map((u) => ({
              id: u._id,
              name: u.name,
              email: u.email,
              profilePic: u?.profileImage || userImage,
              dateJoined: new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              role: u.role,
              mobile: u?.mobileNumber || "---",
              isPremium: u.isPremiumMember,
              instituteName: u?.instituteName || "---",
              presentCourseOfStudy: u?.presentCourseOfStudy || "---",
            })),
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        // ✅ stop both loaders
        setLoadingStats(false);
        setLoadingUsers(false);
      }
    };

    fetchDashboardData();
  }, []);

  function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  return (
    <div className="h-screen w-full py-2 overflow-y-scroll scrollbar-none">
      <Toaster position="top-right" />

      {/* Cards */}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {loadingStats ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-gray-200 animate-pulse dark:bg-gray-800"
            />
          ))
        ) : (
          <>
            {/* Card 1 */}
            <div className="bg-gradient-to-r from-pink-500 to-red-400 text-white rounded-xl shadow-md p-6 relative overflow-hidden">
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              <div className="absolute bottom-4 right-4 opacity-40">
                <Users size={40} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl shadow-md p-6 relative overflow-hidden">
              <h2 className="text-lg font-semibold">Premium Users</h2>
              <p className="text-3xl font-bold mt-2">{stats.premiumUsers}</p>
              <div className="absolute bottom-4 right-4 opacity-40">
                <Crown size={40} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl shadow-md p-6 relative overflow-hidden">
              <h2 className="text-lg font-semibold">Total Courses</h2>
              <p className="text-3xl font-bold mt-2">{stats.totalCourses}</p>
              <div className="absolute bottom-4 right-4 opacity-40">
                <Book size={40} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Latest Users Table */}

      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-4 w-full mb-24 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Latest Registered Users
          </h2>

          <Link
            to="/admin/users"
            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded text-sm font-medium"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr className="text-left text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 text-sm">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2 text-center">Role</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Mobile No.
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Date Joined
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Institute Name
                </th>
                <th className="px-4 py-2 text-center">Present Course</th>
              </tr>
            </thead>

            <tbody>
              {loadingUsers ? (
                [...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse dark:bg-gray-700" />
                        <div className="space-y-2">
                          <div className="w-24 h-3 bg-gray-300 animate-pulse rounded dark:bg-gray-700" />
                          <div className="w-32 h-3 bg-gray-200 animate-pulse rounded dark:bg-gray-800" />
                        </div>
                      </div>
                    </td>

                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        <div className="h-3 w-16 mx-auto bg-gray-300 animate-pulse rounded dark:bg-gray-700" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : latestUsers.length > 0 ? (
                latestUsers.map((user) => (
                  // your original row here (unchanged)
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-xs md:text-sm"
                  >
                    <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-8 h-8 md:h-10 md:w-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          {user.name}
                          {user.isPremium && (
                            <Crown className="text-amber-500" size={14} />
                          )}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </td>

                    <td className="text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${roleStyles[user.role]}`}
                      >
                        {capitalizeFirst(user.role)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {user.mobile}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {user.dateJoined}
                    </td>

                    <td className="px-4 py-3 text-center text-wrap max-w-md text-gray-700 dark:text-gray-300">
                      {user.instituteName}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {user.presentCourseOfStudy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    No recent users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
