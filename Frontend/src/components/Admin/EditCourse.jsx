import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { ImagePlus, X, Plus } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

const labelClass =
  "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block";

const toHumanReadable = (str) => {
  if (!str) return "";

  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.userData);

  const [loading, setLoading] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    courseTitle: "",
    subTitle: "",
    courseDescription: "",
    category: "",
    university: "",
    mode: "",
    language: "",
    actualPrice: "",
    discountedPrice: "",
    whatsappLink: "",
    tags: [],
    isFeatured: false,
    courseImage: null,
    syllabusUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${ApiUrl}/courses/get-course-details/${courseId}`,
          { withCredentials: true },
        );

        const c = res.data.course;

        setFormData({
          courseTitle: c.courseTitle || "",
          subTitle: c.subTitle || "",
          courseDescription: c.courseDescription || "",
          category: c.category || "",
          university: toHumanReadable(c.university) || "",
          mode: c.mode || "",
          language: c.language || "",
          actualPrice: c.actualPrice || "",
          discountedPrice: c.discountedPrice || "",
          whatsappLink: c.whatsappLink || "",
          tags: c.tags || [],
          isFeatured: c.isFeatured || false,
          courseImage: null,
          syllabusUrl: c.syllabusUrl || "",
        });

        setThumbnailPreview(c.courseImage);
      } catch {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      university: "",
    }));
  };

  const handleThumbnailChange = (file) => {
    if (!file) return;
    setFormData((prev) => ({ ...prev, courseImage: file }));
    setThumbnailPreview(URL.createObjectURL(file));
  };

  /* ================= TAGS ================= */

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || formData.tags.includes(tag)) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          data.append("tags", JSON.stringify(formData.tags));
        } else if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await axios.patch(`${ApiUrl}/courses/update-course/${courseId}`, data, {
        withCredentials: true,
      });

      toast.success("Course updated!");
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">Loading course...</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toaster position="top-right" />

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Edit Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IMAGE */}
          <div>
            <label className={labelClass}>Course Thumbnail</label>

            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  className="h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload image</p>
                </>
              )}
              <input
                type="file"
                hidden
                onChange={(e) => handleThumbnailChange(e.target.files[0])}
              />
            </label>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="msc_entrance">MSc Entrance</option>
                <option value="semester_course">Semester Course</option>
                <option value="special">Special/Crash Course</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="live">Live</option>
                <option value="recorded">Recorded</option>
              </select>
            </div>

            {formData.category === "semester_course" && (
              <div>
                <label className={labelClass}>University</label>
                <input
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="e.g. Kalyani University"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Language</label>
              <input
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Actual Price</label>
              <input
                type="number"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Discounted Price</label>
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Whatsapp Link</label>
              <input
                name="whatsappLink"
                value={formData.whatsappLink}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Syllabus URL (optional)</label>
              <input
                name="syllabusUrl"
                placeholder="https://your-storage.com/syllabus.pdf"
                value={formData.syllabusUrl}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className={labelClass}>Course Title</label>
            <input
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              className={inputClass}
            />
          </div>


          {/* SUBTITLE */}
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="courseDescription"
              rows={4}
              value={formData.courseDescription}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* TAGS */}
          <div>
            <label className={labelClass}>Tags</label>

            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-sm text-black dark:text-white"
                >
                  {tag}
                  <X
                    onClick={() => removeTag(tag)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={addTag}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* FEATURED */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featuredCourse"
              className="w-4 h-4 cursor-pointer"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <label
              htmlFor="featuredCourse"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Featured Course
            </label>
          </div>

          {/* SUBMIT */}
          <button
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
