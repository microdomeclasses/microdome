import React from "react";
import { Link } from "react-router";

const CourseCard = ({ course }) => {
  const {
    _id,
    courseTitle,
    subTitle,
    courseImage,
    actualPrice,
    discountedPrice,
    mode,
  } = course;

  const discount =
    actualPrice > discountedPrice
      ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
      : 0;

  return (
    <Link
      to={`/courses/${_id}`}
      className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800
      bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl
      transition-all duration-300 hover:-translate-y-1"
    >
      {/* TYPE BADGE */}
      <div className="absolute top-3 left-3 z-20">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full
    bg-white/10 dark:bg-black/30 backdrop-blur-md
    border border-white/20 dark:border-white/10
    shadow-sm"
        >
          {mode === "live" && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          )}

          <span className="text-[11px] font-medium text-white tracking-wide">
            {mode === "live" ? "Live" : "Recorded"}
          </span>
        </div>
      </div>

      {/* IMAGE */}
      <div className="overflow-hidden">
        <img
          src={courseImage}
          alt={courseTitle}
          className="w-full aspect-video object-cover
          group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-1">
        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
          {courseTitle}
        </h2>

        {/* SUBTITLE */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {subTitle}
        </p>

        {/* PRICE */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ₹{discountedPrice}
              </span>

              {actualPrice > discountedPrice && (
                <span className="text-sm line-through text-gray-500">
                  ₹{actualPrice}
                </span>
              )}
            </div>

            {/* 🔥 NEW LABEL */}
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {mode === "live" ? "per month" : "one-time payment"}
            </span>
          </div>

          {/* DISCOUNT */}
          {discount > 0 && (
            <span
              className="text-[11px] font-medium px-2 py-1 rounded-md
      bg-green-500/10 text-green-500
      dark:text-green-400 backdrop-blur-sm"
            >
              {discount}% OFF
            </span>
          )}
        </div>
        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-zinc-800" />

        {/* CTA */}
        <button
          className="mt-2 text-center py-2 rounded-lg font-medium
                 bg-blue-600 hover:bg-blue-700
                 dark:bg-blue-500 dark:hover:bg-blue-600
                 text-white transition-all cursor-pointer"
        >
          View Details
        </button>
      </div>
    </Link>
  );
};

export default CourseCard;
