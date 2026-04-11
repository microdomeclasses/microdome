import React from "react";
import { Eye } from "lucide-react";

const ViewBtn = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-1.5 rounded-md
      bg-blue-600 hover:bg-blue-700
      text-white
      transition-all duration-200 text-sm
      shadow-sm hover:shadow-md"
    >
      <Eye className="w-4 h-4" />
      <span className="hidden sm:inline">View</span>
    </a>
  );
};

export default ViewBtn;