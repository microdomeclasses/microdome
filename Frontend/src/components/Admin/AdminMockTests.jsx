import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Loader2,
  ClipboardList,
  Pencil,
  Trash2,
  Layers,
  Minus,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MOCK_TEST_TYPE_LABELS = {
  IIT_JAM: "IIT JAM",
  CUET_PG: "CUET PG",
  GAT_B: "GAT-B",
  GATE: "GATE",
};

const AdminMockTests = () => {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [editingTest, setEditingTest] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTestId, setDeletingTestId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingMockTestAllowedAttempts, setUpdatingMocktestAllowedAttempts] =
    useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const user = useSelector((state) => state.auth?.userData);

  const [formData, setFormData] = useState({
    title: "",
    mockTestType: "",
    description: "",
    durationMinutes: "",
    totalMarks: "",
    accessType: "FREE",
    instructions: "",
    status: "DRAFT",
  });

  /* ================= FETCH ================= */

  const fetchMockTests = async () => {
    try {
      const res = await axios.get(`${ApiUrl}/admin/mock-tests`, {
        withCredentials: true,
      });
      setMockTests(res.data.mockTests);
    } catch {
      toast.error("Failed to fetch mock tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      mockTestType: "",
      description: "",
      durationMinutes: "",
      totalMarks: "",
      accessType: "FREE",
      instructions: "",
      status: "DRAFT",
    });
    setEditingTest(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (test) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      mockTestType: test.mockTestType,
      description: test.description,
      durationMinutes: test.durationMinutes,
      totalMarks: test.totalMarks,
      accessType: test.accessType,
      instructions: (test.instructions || []).join("\n"),
      status: test.status,
    });
    setShowModal(true);
  };

  const handleDeleteMockTest = async () => {
    if (!deletingTestId) return;

    setDeleting(true);

    try {
      await axios.delete(`${ApiUrl}/admin/mock-tests/${deletingTestId}`, {
        withCredentials: true,
      });

      toast.success("Mock test deleted");
      setShowDeleteModal(false);
      setDeletingTestId(null);
      fetchMockTests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete mock test",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleIncreaseAllowedAttempts = async (mockTestId) => {
    try {
      setUpdatingMocktestAllowedAttempts(true);
      await axios.patch(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/increase-allowed-attempt`,
        {},
        { withCredentials: true },
      );
      toast.success("Allowed attempts increased successfully");
      fetchMockTests();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdatingMocktestAllowedAttempts(false);
    }
  };

  const handleDecreaseAllowedAttempts = async (mockTestId) => {
    try {
      setUpdatingMocktestAllowedAttempts(true);
      await axios.patch(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/decrease-allowed-attempt`,
        {},
        { withCredentials: true },
      );
      toast.success("Allowed attempts decreased successfully");
      fetchMockTests();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdatingMocktestAllowedAttempts(false);
    }
  };
  /* ================= CREATE ================= */

  const handleCreateMockTest = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await axios.post(
        `${ApiUrl}/admin/mock-tests`,
        {
          ...formData,
          durationMinutes: Number(formData.durationMinutes),
          totalMarks: Number(formData.totalMarks),
          instructions: formData.instructions
            .split("\n")
            .map((i) => i.trim())
            .filter(Boolean),
        },
        { withCredentials: true },
      );

      toast.success("Mock test created successfully");
      setShowModal(false);
      resetForm();
      fetchMockTests();
    } catch {
      toast.error("Failed to create mock test");
    } finally {
      setCreating(false);
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdateMockTest = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axios.patch(
        `${ApiUrl}/admin/mock-tests/${editingTest._id}`,
        {
          title: formData.title,
          description: formData.description,
          durationMinutes: Number(formData.durationMinutes),
          totalMarks: Number(formData.totalMarks),
          accessType: formData.accessType,
          status: formData.status,
          instructions: formData.instructions
            .split("\n")
            .map((i) => i.trim())
            .filter(Boolean),
        },
        { withCredentials: true },
      );

      toast.success("Mock test updated successfully");
      setShowModal(false);
      resetForm();
      fetchMockTests();
    } catch {
      toast.error("Failed to update mock test");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= STATUS UPDATE ================= */

  const handleConfirmStatusChange = async () => {
    if (!statusModal) return;
    setStatusUpdating(true);

    try {
      await axios.patch(
        `${ApiUrl}/admin/mock-tests/${statusModal.id}/status`,
        { status: statusModal.status },
        { withCredentials: true },
      );

      toast.success(
        `Mock test ${statusModal.status === "PUBLISHED" ? "published" : "unpublished"} successfully`,
      );
      setStatusModal(null);
      fetchMockTests();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="mb-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">All Mock Tests</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Mock Test
          </button>
        </div>
      </header>

      {/* Grid */}

      {mockTests.length === 0 ? (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <ClipboardList className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No Mock Test Yet
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Your First Mock Test
          </button>
        </div>
      ) : (
        <div className="grid gap-2 md:gap-4 lg:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[80vh] overflow-y-auto p-4 scrollbar-none">
          {mockTests.map((test) => (
            <div
              key={test._id}
              className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-md p-4 flex flex-col"
            >
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <ClipboardList className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 truncate">
                {test.title}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
                {MOCK_TEST_TYPE_LABELS[test.mockTestType]} •{" "}
                {test.durationMinutes} mins • {test.totalMarks} marks
              </p>

              <div className="mt-3 flex justify-center gap-2">
                {/* Access Type */}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    test.accessType === "FREE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {test.accessType}
                </span>

                {/* Status */}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    test.status === "PUBLISHED"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {test.status}
                </span>
              </div>

              {user?.role === "admin" && (
                <div className="mt-4 w-[95%] mx-auto flex items-center justify-center gap-2">
                  <p className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Allowed Attempts: {test.allowedAttempts}
                  </p>

                  <button
                    onClick={() => handleDecreaseAllowedAttempts(test._id)}
                    disabled={
                      test.allowedAttempts <= 1 ||
                      updatingMockTestAllowedAttempts
                    }
                    className="p-1 border border-red-600 text-red-600 dark:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleIncreaseAllowedAttempts(test._id)}
                    disabled={updatingMockTestAllowedAttempts}
                    className="p-1 border border-green-600 text-green-600 dark:text-green-400 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="mt-4 w-[95%] mx-auto flex items-center gap-2">
                <Link
                  to={`/admin/mock-tests/${test._id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded text-center cursor-pointer"
                >
                  Manage
                </Link>

                <button
                  onClick={() => openEditModal(test)}
                  className="p-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                >
                  <Pencil className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setDeletingTestId(test._id);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 border border-red-600 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-2 w-[95%] mx-auto flex items-center gap-2">
                <Link
                  to={`/admin/mock-tests/${test._id}/results`}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-2 rounded text-center cursor-pointer"
                >
                  Results
                </Link>

                <Link
                  to={`/admin/mock-tests/${test._id}/feedbacks`}
                  className="flex-1 bg-violet-600 hover:bg-violet-800 dark:bg-violet-500 dark:hover:bg-violet-600 text-white py-2 rounded text-center cursor-pointer"
                >
                  Feedbacks
                </Link>
              </div>

              <button
                onClick={() =>
                  setStatusModal({
                    id: test._id,
                    status: test.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                  })
                }
                className={`w-[95%] mx-auto mt-2 py-2 rounded cursor-pointer ${
                  test.status === "PUBLISHED"
                    ? "border border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "border border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                }`}
              >
                {test.status === "PUBLISHED" ? "Unpublish" : "Publish"}
              </button>
            </div>
          ))}
        </div>
      )}
      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none border border-gray-200 dark:border-zinc-800">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {editingTest ? "Edit Mock Test" : "Create Mock Test"}
            </h2>

            <form
              onSubmit={
                editingTest ? handleUpdateMockTest : handleCreateMockTest
              }
              className="space-y-3"
            >
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="IIT JAM Biology Mock Test - 1"
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Exam Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exam Type
                </label>
                <select
                  name="mockTestType"
                  value={formData.mockTestType}
                  disabled={!!editingTest}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 mt-1 cursor-pointer disabled:bg-gray-100 dark:disabled:bg-zinc-800"
                  required
                >
                  <option value="">Select exam type</option>
                  <option value="IIT_JAM">IIT JAM</option>
                  <option value="CUET_PG">CUET PG</option>
                  <option value="GAT_B">GAT-B</option>
                  <option value="GATE">GATE</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Full length mock test based on latest pattern"
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Duration & Marks */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    placeholder="180"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
              </div>

              {/* Access Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access Type
                </label>
                <select
                  name="accessType"
                  value={formData.accessType}
                  disabled={!!editingTest}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 mt-1 cursor-pointer disabled:bg-gray-100 dark:disabled:bg-zinc-800"
                >
                  <option value="FREE">FREE</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>

              {/* Instructions */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Each question has only one correct answer"
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 mt-1 h-40"
                />
              </div>

              <button
                type="submit"
                disabled={creating || updating}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 cursor-pointer"
              >
                {(creating || updating) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {editingTest
                  ? updating
                    ? "Updating..."
                    : "Update Mock Test"
                  : creating
                    ? "Creating..."
                    : "Create Mock Test"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-950 rounded-xl w-full max-w-md p-6 relative border border-gray-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Delete Mock Test?
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              This action cannot be undone. All sections and questions under
              this mock test will be permanently deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingTestId(null);
                }}
                disabled={deleting}
                className="px-4 py-2 rounded border border-gray-300 dark:border-zinc-700 
                   text-gray-700 dark:text-gray-300 
                   hover:bg-gray-100 dark:hover:bg-zinc-800 
                   cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteMockTest}
                disabled={deleting}
                className="px-4 py-2 rounded 
                   bg-red-600 hover:bg-red-700 
                   dark:bg-red-500 dark:hover:bg-red-600 
                   text-white 
                   flex items-center gap-2 
                   cursor-pointer disabled:opacity-70"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STATUS MODAL ================= */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-950 rounded-xl w-full max-w-md p-6 border border-gray-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Confirm Status Change
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Are you sure you want to{" "}
              <b>
                {statusModal.status === "PUBLISHED" ? "Publish" : "Unpublish"}
              </b>{" "}
              this mock test?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setStatusModal(null)}
                disabled={statusUpdating}
                className="px-4 py-2 rounded border border-gray-300 dark:border-zinc-700 
                   text-gray-700 dark:text-gray-300
                   hover:bg-gray-100 dark:hover:bg-zinc-800
                   cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmStatusChange}
                disabled={statusUpdating}
                className="px-4 py-2 rounded 
                   bg-blue-500 hover:bg-blue-600 
                   dark:bg-blue-500 dark:hover:bg-blue-600
                   text-white flex items-center gap-2 
                   cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {statusUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminMockTests;
