import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import userImage from "../../assets/user-img.jpeg";
import { useSelector } from "react-redux";
import { Crown } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AllUsers = () => {
  const currentUser = useSelector((state) => state.auth?.userData);

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);

  const [openRoleMenu, setOpenRoleMenu] = useState(null);

  const roleStyles = {
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    instructor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    user: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  const [confirmData, setConfirmData] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const confirmRoleChange = async () => {
    if (!confirmData) return;

    const { userId, newRole } = confirmData;
    setUpdatingRole(true);

    try {
      await axios.patch(
        `${ApiUrl}/admin/change-user-role/${userId}`,
        { role: newRole },
        { withCredentials: true },
      );

      toast.success("User role updated");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingRole(false);
      setConfirmData(null);
    }
  };

  const fetchUsers = () => {
    setLoading(true);

    axios
      .get(`${ApiUrl}/admin/get-all-users`, { withCredentials: true })
      .then((res) => {
        if (res.data.users && Array.isArray(res.data.users)) {
          setUsers(
            res.data.users.map((u) => ({
              id: u._id,
              name: u.name,
              email: u.email,
              profilePic: u?.profileImage || userImage,
              dateJoined: new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              mobile: u?.mobileNumber || "---",
              instituteName: u?.instituteName || "---",
              role: u.role,
              isPremium: u.isPremiumMember,
              presentCourseOfStudy: u?.presentCourseOfStudy || "---",
            })),
          );
        } else {
          toast.error("No users found");
          setUsers([]);
        }
      })
      .catch(() => {
        toast.error("Failed to load users");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      
      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>

      {/* Text */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Loading users...
      </p>

    </div>
  );
}

  return (
    <div className="h-[90vh] flex flex-col bg-white dark:bg-gray-950 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
      <Toaster position="top-right" />

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800 gap-3">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">
          All Users
        </h2>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}

      <div className="flex-1 overflow-y-scroll scrollbar-none">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
              <tr className="text-left text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 text-sm md:text-base">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2 text-center">Role</th>
                <th className="px-4 py-2 text-center">Mobile No.</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Date Joined
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Institute Name
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Present Course
                </th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-xs md:text-sm text-gray-700 dark:text-gray-300"
                >
                  {/* Name */}

                  <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-8 h-8 md:h-10 md:w-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {user.name}
                        {user.isPremium && <Crown className="text-amber-500" size={14} />}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </td>

                  {/* Role */}

                  <td className="px-4 py-3 text-center relative">
                    {currentUser?.role === "admin" ? (
                      user.id === currentUser._id ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[user.role]}`}
                        >
                          {capitalizeFirst(user.role)}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setOpenRoleMenu(
                                openRoleMenu === user.id ? null : user.id,
                              )
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${roleStyles[user.role]}`}
                          >
                            {capitalizeFirst(user.role)}
                          </button>

                          {openRoleMenu === user.id && (
                            <div className="absolute z-20 mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow overflow-hidden px-1.5 py-2 text-gray-800 dark:text-gray-200">
                              <div className="px-2 pt-1 text-left text-xs font-bold">
                                Change Role
                              </div>

                              <hr className="my-1.5 border-gray-300 dark:border-gray-700" />

                              {["user", "instructor", "admin"].map((role) => (
                                <button
                                  key={role}
                                  onClick={() => {
                                    setOpenRoleMenu(null);

                                    if (role !== user.role) {
                                      setConfirmData({
                                        userId: user.id,
                                        userName: user.name,
                                        newRole: role,
                                      });
                                    }
                                  }}
                                  className="p-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                                >
                                  <span
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium ${roleStyles[role]}`}
                                  >
                                    {capitalizeFirst(role)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[user.role]}`}
                      >
                        {capitalizeFirst(user.role)}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">{user.mobile}</td>
                  <td className="px-4 py-3 text-center">{user.dateJoined}</td>

                  <td className="px-4 py-3 text-center">
                    {user.instituteName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.presentCourseOfStudy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}

      {filteredUsers.length > usersPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200">
          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded cursor-pointer disabled:cursor-not-allowed"
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
                  ? "bg-blue-500 text-white cursor-pointer"
                  : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded cursor-pointer disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Modal */}

      {confirmData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Confirm Role Change
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to make{" "}
              <strong>"{confirmData.userName}"</strong>{" "}
              <strong className="capitalize">"{confirmData.newRole}"</strong>?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmData(null)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200
             bg-gray-100 text-gray-800 border border-gray-200
             hover:bg-gray-200 hover:border-gray-300
             dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700
             dark:hover:bg-zinc-700 dark:hover:border-zinc-600
             focus:outline-none focus:ring-2 focus:ring-gray-400
             cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmRoleChange}
                disabled={updatingRole}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200
             bg-blue-600 text-white
             hover:bg-blue-700
             disabled:bg-blue-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70
             dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-400
             focus:outline-none focus:ring-2 focus:ring-blue-400
             flex items-center justify-center gap-2"
              >
                {updatingRole && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {updatingRole ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
