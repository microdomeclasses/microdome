import { useState, useEffect } from "react";
import { RiArrowDownSLine, RiFolderOpenLine } from "@remixicon/react";

const CourseSection = ({ sections, currentLecture, onSelectLecture }) => {
  const [openSections, setOpenSections] = useState([]);

  useEffect(() => {
    setOpenSections(new Array(sections.length).fill(false));
  }, [sections]);

  const toggleSection = (index) => {
    const updated = [...openSections];
    updated[index] = !updated[index];
    setOpenSections(updated);
  };

  const getDownloadUrl = ({ url, fileName }) => {
    if (!url) return "#";

    let safeUrl = url.startsWith("http://")
      ? url.replace("http://", "https://")
      : url;

    const safeFileName = (fileName || "notes")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    return safeUrl.includes("/upload/")
      ? safeUrl.replace("/upload/", `/upload/fl_attachment:${safeFileName}/`)
      : safeUrl;
  };

  return (
    <div className="w-full max-h-[60vh] overflow-y-auto scrollbar-none">
      {sections.map((section, index) => (
        <div key={section._id || index} className="mb-3">

          {/* SECTION HEADER */}
          <div
            onClick={() => toggleSection(index)}
            className="p-3 rounded-lg border border-gray-200 dark:border-zinc-700 
                       bg-gray-50 dark:bg-zinc-800 
                       cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm md:text-base">
                Section {index + 1}: {section.title}
              </h3>

              <RiArrowDownSLine
                size={20}
                className={`transition-transform ${
                  openSections[index] ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* LECTURES */}
          {openSections[index] && (
            <div className="mt-1 border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">

              {section.lectures.map((lecture, idx) => {
                const isActive =
                  currentLecture?._id === lecture._id;

                return (
                  <div
                    key={lecture._id || idx}
                    onClick={() => onSelectLecture(lecture, section)}
                    className={`p-3 cursor-pointer transition
                      ${
                        isActive
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                      }`}
                  >
                    <div className="text-sm">
                      {idx + 1}. {lecture.title}
                    </div>

                    {/* NOTES */}
                    {lecture?.noteURL && (
                      <div className="flex justify-end mt-2">
                        <a
                          href={getDownloadUrl({
                            url: lecture.noteURL,
                            fileName: lecture.noteTitle,
                          })}
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-2 py-1 rounded border border-blue-400 
                                     hover:bg-blue-100 dark:hover:bg-blue-900/30
                                     flex items-center gap-1"
                        >
                          <RiFolderOpenLine size={14} />
                          Notes
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseSection;