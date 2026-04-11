import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Loader2,
  ImagePlus,
  Pencil,
  AlertTriangle,
  Layers,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminMockTestBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [confirmBundle, setConfirmBundle] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    actualPrice: "",
    discountedPrice: "",
    thumbnailImage: null,
    isActive: true,
  });

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      const res = await axios.get(`${ApiUrl}/admin/mock-test-bundles`, {
        withCredentials: true,
      });
      setBundles(res.data.data || []);
    } catch {
      toast.error("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FORM ================= */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      actualPrice: "",
      discountedPrice: "",
      thumbnailImage: null,
      isActive: true,
    });
    setThumbnailPreview(null);
    setEditingBundle(null);
  };

  const openEditModal = (bundle) => {
    setEditingBundle(bundle);
    setForm({
      title: bundle.title,
      description: bundle.description,
      actualPrice: bundle.actualPrice,
      discountedPrice: bundle.discountedPrice,
      thumbnailImage: null,
      isActive: bundle.isActive,
    });
    setThumbnailPreview(bundle.thumbnail);
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleThumbnailChange = (file) => {
    if (!file) return;
    setForm({ ...form, thumbnailImage: file });
    setThumbnailPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (+form.discountedPrice > +form.actualPrice) {
      toast.error("Discounted price cannot exceed actual price");
      return;
    }

    setCreating(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null) fd.append(k, v);
      });

      if (editingBundle) {
        await axios.patch(
          `${ApiUrl}/admin/mock-test-bundles/${editingBundle._id}`,
          fd,
          { withCredentials: true },
        );
        toast.success("Bundle updated successfully");
      } else {
        await axios.post(`${ApiUrl}/admin/mock-test-bundles`, fd, {
          withCredentials: true,
        });
        toast.success("Bundle created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch {
      toast.error("Operation failed");
    } finally {
      setCreating(false);
    }
  };

  /* ================= STATUS ================= */

  const confirmStatusChange = async () => {
    if (!confirmBundle) return;

    setStatusLoading(true);
    try {
      await axios.patch(
        `${ApiUrl}/admin/mock-test-bundles/${confirmBundle._id}/status`,
        { isActive: !confirmBundle.isActive },
        { withCredentials: true },
      );

      toast.success("Bundle status updated");
      setConfirmBundle(null);
      fetchData();
    } catch {
      toast.error("Failed to update bundle status");
    } finally {
      setStatusLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
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
          Mock Test Bundles
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                     bg-blue-600 text-white hover:bg-blue-700
                     dark:bg-blue-500 dark:hover:bg-blue-600 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Bundle
        </button>
      </header>

      {/* EMPTY */}
      {bundles.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <Layers className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No Mock Test Bundles Yet
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create your first bundle
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <div
              key={bundle._id}
              className="group rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800
                         bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg
                         transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={bundle.thumbnail}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                  {bundle.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {bundle.description}
                </p>

                {/* PRICE */}
                <div>
                  <span className="font-bold text-green-700 dark:text-green-400">
                    ₹{bundle.discountedPrice}
                  </span>
                  <span className="ml-2 line-through text-gray-500 text-sm">
                    ₹{bundle.actualPrice}
                  </span>
                </div>

                {/* STATUS */}
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      bundle.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {bundle.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>

                  <span className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                    {bundle.mockTestIds.length} TESTS
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    to={`/admin/mock-test-bundles/${bundle._id}`}
                    className="flex-1 text-center py-2 rounded-lg font-medium
                               bg-blue-600 text-white hover:bg-blue-700
                               dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                  >
                    Manage
                  </Link>

                  <button
                    onClick={() => openEditModal(bundle)}
                    className="p-2 border rounded-lg text-blue-600 dark:text-blue-400
                               hover:bg-blue-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setConfirmBundle(bundle)}
                  className={`py-2 rounded-lg border transition cursor-pointer ${
                    bundle.isActive
                      ? "border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  }`}
                >
                  {bundle.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmBundle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md border dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Confirm Action
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to{" "}
              <b>{confirmBundle.isActive ? "deactivate" : "activate"}</b> this
              bundle?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmBundle(null)}
                className="px-4 py-2 border rounded-lg dark:border-zinc-700
                           hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-xl p-6 relative 
                  border border-gray-200 dark:border-zinc-800 
                  max-h-[90vh] overflow-y-auto"
          >
            {/* CLOSE */}
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 p-1 rounded-md 
                 hover:bg-gray-100 dark:hover:bg-zinc-800 
                 text-gray-600 dark:text-gray-400 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100">
              {editingBundle ? "Edit Bundle" : "Create Bundle"}
            </h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Bundle title"
                  className="w-full border border-gray-300 dark:border-zinc-700 
                     bg-white dark:bg-zinc-800 
                     text-gray-800 dark:text-gray-100
                     rounded-lg px-3 py-2
                     outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Bundle description"
                  className="w-full border border-gray-300 dark:border-zinc-700 
                     bg-white dark:bg-zinc-800 
                     text-gray-800 dark:text-gray-100
                     rounded-lg px-3 py-2
                     outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              {/* THUMBNAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail
                </label>

                <label
                  className="flex flex-col items-center justify-center h-40
                     border-2 border-dashed rounded-lg
                     border-gray-300 dark:border-zinc-700
                     bg-gray-50 dark:bg-zinc-800
                     hover:bg-gray-100 dark:hover:bg-zinc-700
                     transition cursor-pointer"
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      className="h-full object-contain"
                    />
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload image or browse image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG, JPEG
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleThumbnailChange(e.target.files[0])}
                  />
                </label>
              </div>

              {/* PRICES */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Actual Price
                  </label>
                  <input
                    type="number"
                    name="actualPrice"
                    value={form.actualPrice}
                    onChange={handleChange}
                    placeholder="1999"
                    className="w-full border border-gray-300 dark:border-zinc-700 
                       bg-white dark:bg-zinc-800 
                       text-gray-800 dark:text-gray-100
                       rounded-lg px-3 py-2
                       outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={form.discountedPrice}
                    onChange={handleChange}
                    placeholder="999"
                    className="w-full border border-gray-300 dark:border-zinc-700 
                       bg-white dark:bg-zinc-800 
                       text-gray-800 dark:text-gray-100
                       rounded-lg px-3 py-2
                       outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 text-white py-2 rounded-lg 
                   hover:bg-blue-700 transition
                   disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {creating ? "Saving..." : "Save Bundle"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMockTestBundles;
