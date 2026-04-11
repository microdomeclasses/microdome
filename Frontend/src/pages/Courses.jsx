import { useEffect, useState } from "react";
import axios from "axios";
import { CourseCard } from "../components";
import { Helmet } from "react-helmet-async";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/courses/get-all-courses`);
        setCourses(res.data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ================= GROUPING ================= */

  const groupCourses = () => {
    const grouped = {
      msc_entrance: [],
      special: [],
      semester: {},
    };

    courses.forEach((course) => {
      if (course.category === "msc_entrance") {
        grouped.msc_entrance.push(course);
      } else if (course.category === "special") {
        grouped.special.push(course);
      } else if (course.category === "semester_course") {
        const uni = course.university || "other";

        if (!grouped.semester[uni]) {
          grouped.semester[uni] = [];
        }

        grouped.semester[uni].push(course);
      }
    });

    return grouped;
  };

  const grouped = groupCourses();

  /* ================= TABS ================= */

  const universities = [
    ...new Set(
      courses
        .filter((c) => c.category === "semester_course")
        .map((c) => c.university),
    ),
  ];

  const tabs = [
    { key: "all", label: "All Courses" },
    { key: "msc_entrance", label: "M.Sc Entrance" },
    ...universities.map((u) => ({
      key: u,
      label: toHuman(u),
    })),
    { key: "special", label: "Crash Courses" },
  ];

  /* ================= FILTER ================= */

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "all") return true;

    if (activeTab === "msc_entrance") {
      return course.category === "msc_entrance";
    }

    if (activeTab === "special") {
      return course.category === "special";
    }

    return course.university === activeTab;
  });

  /* ================= UI ================= */

  return (
    <>
      <Helmet>
        <title>Courses | Microdome Classes</title>

        <meta
          name="description"
          content="Explore all Microdome courses for MSc entrance exams including IIT JAM, GATE, CUET PG, and more. Structured learning with expert guidance."
        />

        <meta
          name="keywords"
          content="MSc courses, IIT JAM coaching, GATE biology, CUET PG preparation, Microdome courses"
        />

        <meta property="og:title" content="Courses | Microdome Classes" />
        <meta
          property="og:description"
          content="Browse structured courses designed to help you crack MSc entrance exams like IIT JAM, GATE, and CUET PG."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://microdomeclasses.in/courses" />
        <meta property="og:image" content="/microdomeLogo.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Courses | Microdome Classes" />
        <meta
          name="twitter:description"
          content="Explore all courses for MSc entrance preparation with Microdome."
        />
        <meta name="twitter:image" content="/microdomeLogo.png" />

        <link rel="canonical" href="https://microdomeclasses.in/courses" />
      </Helmet>

      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-32">
          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">
              Explore Our <span className="text-highlighted">Courses</span>
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Find the right course for your goal.
            </p>
          </div>

          {/* ================= TABS ================= */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-lg cursor-pointer text-sm whitespace-nowrap transition-all
                  ${
                    activeTab === tab.key
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ================= LOADING ================= */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-60 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"
                  />
                ))}
            </div>
          )}

          {/* ================= CONTENT ================= */}
          {!loading && courses.length > 0 && (
            <>
              {activeTab === "all" ? (
                <div className="space-y-16">
                  {/* MSC */}
                  {grouped.msc_entrance.length > 0 && (
                    <Section
                      title="M.Sc Entrance Courses"
                      subTitle="Prepare for your M.Sc entrance exams with our comprehensive courses."
                    >
                      {grouped.msc_entrance.map((course) => (
                        <CourseCard key={course._id} course={course} />
                      ))}
                    </Section>
                  )}

                  {/*Divider*/}
                  <div className="h-px bg-gray-200 dark:bg-zinc-800" />

                  {/* SEMESTER */}
                  {Object.entries(grouped.semester).map(([uni, list]) => (
                    <>
                      <Section
                        key={uni}
                        title={`${toHuman(uni)} Semester Courses`}
                        subTitle={`Ace your ${toHuman(uni)} semester exams with our expertly crafted courses.`}
                      >
                        {list.map((course) => (
                          <CourseCard key={course._id} course={course} />
                        ))}
                      </Section>
                      {/*Divider*/}
                      <div className="h-px bg-gray-200 dark:bg-zinc-800" />
                    </>
                  ))}

                  {/* SPECIAL */}
                  {grouped.special.length > 0 && (
                    <Section
                      title="Crash Courses"
                      subTitle="Explore our special courses designed to give you an edge in your studies."
                    >
                      {grouped.special.map((course) => (
                        <CourseCard key={course._id} course={course} />
                      ))}
                    </Section>
                  )}
                </div>
              ) : (
                <>
                  {filteredCourses.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                      No courses found
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ================= SECTION ================= */

const Section = ({ title, subTitle, children }) => (
  <div>
    <h2 className="text-xl md:text-2xl font-semibold mb-1">{title}</h2>
    <h3 className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8">
      {subTitle}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

/* ================= UTIL ================= */

const toHuman = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default Courses;
