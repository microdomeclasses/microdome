import { FileText } from "lucide-react";
import DownloadBtn from "./DownloadBtn";
import ViewBtn from "./ViewBtn";

const Brochure = ({ title, url }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl 
    border border-gray-200 dark:border-zinc-800 
    bg-gray-50 dark:bg-zinc-900 hover:shadow-sm transition">

      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      <div className="flex gap-2">
        <ViewBtn url={url} />
        <DownloadBtn url={url} />
      </div>
    </div>
  );
};

export default Brochure;