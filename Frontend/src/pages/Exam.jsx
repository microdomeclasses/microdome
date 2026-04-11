import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import examsData from "../assets/examsData";
import { Helmet } from "react-helmet-async";

const Exam = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Helmet>
        <title>Exams & Institutes | Microdome Classes</title>
        <meta
          name="description"
          content="Explore IIT JAM, GATE, CUET PG and top institutes."
        />
      </Helmet>

      <section className="py-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Exams & <span className="text-highlighted">Institutes</span>
            </h2>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Discover top exams and the institutes you can get through them.
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {examsData.map((exam, index) => (
              <ExamCard key={index} exam={exam} index={index} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Exam;

/* ================= CARD COMPONENT ================= */

const ExamCard = ({ exam, index }) => {
  const [expanded, setExpanded] = useState(false);

  const visibleColleges = expanded
    ? exam.colleges
    : exam.colleges.slice(0, 5);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 100}
      className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800
      rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >

      {/* TITLE */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {exam.examName}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {exam.description}
      </p>

      {/* COURSES */}
      <div className="mt-3 flex flex-wrap gap-2">
        {exam.courses.map((c, i) => (
          <span
            key={i}
            className="text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          >
            {c}
          </span>
        ))}
      </div>

      {/* COLLEGES */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-1">
          Top Institutes:
        </p>

        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          {visibleColleges.map((c, i) => (
            <p key={i}>• {c.collegeName}</p>
          ))}
        </div>

        {/* TOGGLE BUTTON */}
        {exam.colleges.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer"
          >
            {expanded
              ? "Show less"
              : `+${exam.colleges.length - 5} more institutes`}
          </button>
        )}
      </div>

    </div>
  );
};