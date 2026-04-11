import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  PlayCircle,
  MessageCircle,
  Video,
  FileText,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";

import BrochureTopic from "../components/BrochureTopic.jsx";

import GateInformationBrochure from "../assets/pdfs/GATE2025InformationBrochure.pdf";
import CuetPgInformationBrochure from "../assets/pdfs/InformationBrochureCUET-PG2025.pdf";
import GatBInformationBrochure from "../assets/pdfs/InformationBulletinGAT-B2025.pdf";
import JamInformationBrochure from "../assets/pdfs/JAM2025InformationBrochure.pdf";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const brochures = [
  {
    id: 1,
    topic: "Entrance Exam Brochures",
    pdfs: [
      { title: "IIT JAM", file: JamInformationBrochure },
      { title: "GATE", file: GateInformationBrochure },
      { title: "GAT-B", file: GatBInformationBrochure },
      { title: "CUET-PG", file: CuetPgInformationBrochure },
    ],
  },
];

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/courses/${id}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const isEnrolled = userData?.enrolledCourses?.some(
    (id) => id === course?._id,
  );

  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      toast.warn("Please login to continue");
      // navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate(`/my-courses/${course._id}`);
      return;
    }

    navigate(`/checkout/course/${course._id}`);
  };

  const getButtonText = () => {
    // if (!isLoggedIn) return "Login to Enroll";
    if (isEnrolled) return "Go to Course";
    return "Enroll Now";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center">
        Course not found
      </div>
    );
  }

  const discount =
    course.actualPrice > course.discountedPrice
      ? Math.round(
          ((course.actualPrice - course.discountedPrice) / course.actualPrice) *
            100,
        )
      : 0;

  const liveFeatures = [
    {
      icon: PlayCircle,
      text: "Live interactive classes",
    },
    {
      icon: MessageCircle,
      text: "Doubt clearing support",
    },
    {
      icon: Video,
      text: "Recorded access after sessions",
    },
    {
      icon: FileText,
      text: "Structured notes and materials",
    },
  ];

  const recordedFeatures = [
    {
      icon: Video,
      text: "High-quality recorded lectures",
    },
    {
      icon: Clock,
      text: "Learn at your own pace",
    },
    {
      icon: FileText,
      text: "Structured notes and materials",
    },
    {
      icon: CheckCircle,
      text: "Practice questions included",
    },
  ];

  const features = course.mode === "live" ? liveFeatures : recordedFeatures;

  return (
    <>
      <Helmet>
        <title>
          {course?.courseTitle
            ? `${course.courseTitle} | Microdome Classes`
            : "Course Details | Microdome"}
        </title>

        <meta
          name="description"
          content={
            course?.subTitle ||
            "Detailed course for MSc entrance preparation with structured content and expert guidance."
          }
        />

        <meta
          name="keywords"
          content={`${course?.courseTitle || "MSc course"}, Microdome, IIT JAM, GATE, CUET PG`}
        />

        {/* OG */}
        <meta
          property="og:title"
          content={
            course?.courseTitle
              ? `${course.courseTitle} | Microdome Classes`
              : "Course | Microdome"
          }
        />

        <meta
          property="og:description"
          content={
            course?.subTitle || "Explore this course on Microdome Classes."
          }
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content={`https://microdomeclasses.in/courses/${course?._id}`}
        />

        <meta
          property="og:image"
          content={course?.courseImage || "/microdomeLogo.png"}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content={
            course?.courseTitle ? `${course.courseTitle} | Microdome` : "Course"
          }
        />

        <meta
          name="twitter:description"
          content={course?.subTitle || "Explore this course on Microdome"}
        />

        <meta
          name="twitter:image"
          content={course?.courseImage || "/microdomeLogo.png"}
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href={`https://microdomeclasses.in/courses/${course?._id}`}
        />
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white">
        <ToastContainer />

        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
          {/* ================= HERO ================= */}
          <div
            className="rounded-2xl border border-gray-200 dark:border-zinc-800 
bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-zinc-900 
shadow-lg overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-10 p-6 md:p-10 items-start">
              {/* IMAGE */}
              <div className="w-full">
                <div className="w-full overflow-hidden rounded-xl">
                  <img
                    src={course.courseImage}
                    className="w-full aspect-video md:aspect-auto object-cover"
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col gap-6">
                {/* TITLE */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                    {course.courseTitle}
                  </h1>

                  <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                    {course.courseDescription}
                  </p>
                </div>

                {/* META */}
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800">
                    {course.mode === "live" ? "Live Batch" : "Recorded"}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800">
                    {course.language}
                  </span>
                </div>

                {/* PRICE (NO BOX NOW) */}
                <div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{course.discountedPrice}
                    </span>

                    {course.actualPrice !== course.discountedPrice && (
                      <span className="line-through text-gray-500 text-lg">
                        ₹{course.actualPrice}
                      </span>
                    )}

                    {discount > 0 && (
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full 
            bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      >
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {course.mode === "live" ? "per month" : "one-time payment"}
                  </p>

                  <button
                    onClick={handleEnrollClick}
                    className={`mt-4 w-full px-6 py-3 rounded-lg font-medium transition shadow hover:shadow-md cursor-pointer
  ${
    isEnrolled
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= FEATURES ================= */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">What you’ll get</h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="group p-5 rounded-xl border border-gray-200 dark:border-zinc-800 
          bg-white dark:bg-zinc-900 hover:shadow-md transition"
                  >
                    {/* ICON */}
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-lg
            bg-blue-50 dark:bg-blue-500/10 
            border border-blue-100 dark:border-blue-500/20
            text-blue-600 dark:text-blue-400 mb-3"
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* TEXT */}
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= RESOURCES ================= */}
          <div className="mt-16">
            {course.category === "msc_entrance" && (
              <div
                className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 
        bg-white dark:bg-zinc-900"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Entrance Exam Brochures
                </h2>

                {brochures.map((section) => (
                  <BrochureTopic
                    key={section.id}
                    topic={section.topic}
                    brochures={section.pdfs}
                  />
                ))}
              </div>
            )}

            {course.syllabusUrl && (
              <div
                className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 
        bg-white dark:bg-zinc-900"
              >
                <h2 className="text-xl font-semibold mb-4">Course Syllabus</h2>

                <div
                  className="flex items-center justify-between p-4 rounded-xl 
          border border-gray-200 dark:border-zinc-700  bg-gray-50 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">
                      View full syllabus
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm font-medium">
                    <a
                      href={course.syllabusUrl}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
