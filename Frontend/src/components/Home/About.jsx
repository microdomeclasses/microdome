import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import cellVideo from "../../assets/cell.mp4";
import { Link } from "react-router";
import { BookOpen, PlayCircle } from "lucide-react";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="about" className="mt-12 md:mt-24 w-full flex justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2" data-aos="fade-up">
          <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">
            Build Your Future in
            <span className="text-highlighted"> Biology & Biotechnology</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            Microdome Classes helps students crack M.Sc entrance exams like
            IIT-JAM, CUET-PG, GAT-B and more through structured courses, expert
            mentors, and realistic mock tests.
          </p>
          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Watch Free Lecture */}
            <Link
              to="/resources"
              className="
      w-full sm:w-auto
      inline-flex items-center justify-center gap-2
      px-6 py-3
      text-base font-bold
      rounded-lg
      border border-gray-300 dark:border-gray-700
      text-gray-800 dark:text-gray-200
      transition-all duration-200
      hover:border-highlighted
      hover:text-highlighted
      hover:shadow-md
    "
            >
              <PlayCircle size={20} />
              Watch Free Lecture
            </Link>

            {/* Explore Courses */}
            <Link
              to="/courses"
              className="
      w-full sm:w-auto
      inline-flex items-center justify-center gap-2
      px-6 py-3
      text-base font-bold
      rounded-lg
      bg-highlighted
      text-white
      shadow-lg
      transition-all duration-200
      hover:bg-highlighted-hover
      hover:shadow-xl
      active:scale-[0.97]
    "
            >
              <BookOpen size={20} />
              Explore Courses
            </Link>
          </div>
        </div>

        {/* Right Video */}
        <div
          className="w-full md:w-1/2"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full rounded-2xl shadow-xl"
          >
            <source src={cellVideo} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

export default About;
