import React from "react";
import { Download } from "lucide-react";

const DownloadBtn = ({ url }) => {
  return (
    <a
      href={url}
      download
      className="flex items-center gap-2 px-3 py-1.5 rounded-md
      border border-gray-200 dark:border-zinc-700
      bg-white dark:bg-zinc-900
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-zinc-800
      transition-all duration-200 text-sm"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download</span>
    </a>
  );
};

export default DownloadBtn;