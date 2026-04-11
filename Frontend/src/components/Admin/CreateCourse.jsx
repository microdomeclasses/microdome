import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { ImagePlus, X, Plus } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

const labelClass =
  "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block";

const CreateCourse = () => {
  const user = useSelector((state) => state.auth?.userData);
  const role = user?.role;
  const navigate = useNavigate();

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

  useEffect(() => {
    if (role && role !== "admin") {
      navigate("/admin/dashboard");
    }
  }, [role]);

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
        } else {
          data.append(key, formData[key]);
        }
      });

      await axios.post(`${ApiUrl}/courses/create-course`, data, {
        withCredentials: true,
      });

      toast.success("Course created!");
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toaster position="top-right" />

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm p-6">

        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Create Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* IMAGE */}
          <div>
            <label className={labelClass}>Course Thumbnail</label>

            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  className="h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or JPEG
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleThumbnailChange(e.target.files[0])
                }
                required
              />
            </label>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* CATEGORY */}
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleCategoryChange(e.target.value)
                }
                className={inputClass}
                required
              >
                <option value="">Select Category</option>
                <option value="msc_entrance">MSc Entrance</option>
                <option value="semester_course">Semester Course</option>
                <option value="special">Special/Crash Course</option>
              </select>
            </div>

            {/* MODE */}
            <div>
              <label className={labelClass}>Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select Mode</option>
                <option value="live">Live</option>
                <option value="recorded">Recorded</option>
              </select>
            </div>

            {/* UNIVERSITY */}
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

            {/* LANGUAGE */}
            <div>
              <label className={labelClass}>Language</label>
              <input
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g. Hinglish or Bengali"
                className={inputClass}
              />
            </div>

            {/* PRICES */}
            <div>
              <label className={labelClass}>Actual Price</label>
              <input
                type="number"
                placeholder="1999"
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
                placeholder="999"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* WHATSAPP */}
            <div className="md:col-span-2">
              <label className={labelClass}>Whatsapp Link</label>
              <input
                name="whatsappLink"
                value={formData.whatsappLink}
                onChange={handleChange}
                placeholder="https://chat.whatsapp.com/your-group-link"
                className={inputClass}
              />
            </div>

             {/* SYLLABUS URL */}
            <div className="md:col-span-2">
              <label className={labelClass}>Syllabus URL (optional)</label>
              <input
                name="syllabusUrl"
                value={formData.syllabusUrl}
                onChange={handleChange}
                placeholder="https://your-storage.com/syllabus.pdf"
                className={inputClass}
              />
            </div>

          </div>

          {/* TITLE */}
          <div>
            <label className={labelClass}>Course Title</label>
            <input
              name="courseTitle"
              placeholder="A concise, catchy title for the course"
              value={formData.courseTitle}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* SUBTITLE */}
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              name="subTitle"
              placeholder="A catchy subtitle to attract students"
              value={formData.subTitle}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={labelClass}>Course Description</label>
            <textarea
              name="courseDescription"
              placeholder="A brief description about the course"
              rows={4}
              value={formData.courseDescription}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* TAGS */}
          <div>
            <label className={labelClass}>Tags (optional)</label>

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
                placeholder="Add tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
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
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer"
            />
            <label htmlFor="featuredCourse" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Featured Course
            </label>
          </div>

          {/* SUBMIT */}
          <button
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateCourse;