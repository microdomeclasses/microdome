import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router";
import { Rocket, ClipboardList } from "lucide-react";
import YoutubeVideo from "../YouTubeVideo";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (in ms)
      once: true, // animation happens only once
      easing: "ease-in-out",
    });
  }, []);

  return (

      <section
        id="hero"
        className="w-full flex items-center justify-center relative"
      >
        <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center">
          {/* Heading */}
          <div className="md:mt-40 mt-32 mb-5 w-full" data-aos="fade-up">
            <h1 className="text-center text-4xl md:text-6xl lg:text-7xl font-bold leading-10 md:leading-14 lg:leading-20">
              Unlock Your Potential With{" "}
              <span className="gradiant-text">Microdome</span> Classes
            </h1>
          </div>

          {/* Subtext */}
          <div
            className="mt-1 w-full max-w-4xl px-0 md:px-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p className="text-center text-base md:text-lg leading-relaxed">
              At Microdome Classes, we specialize in online coaching for M.Sc
              and M.Tech entrance exams, including IIT JAM, GATE and CUET PG.
              Our comprehensive courses provide students with the tools they
              need to excel in their biology studies and achieve their academic
              goals.
            </p>
          </div>

          {/* Buttons */}

          <div
            className="mt-8 w-full flex flex-col sm:flex-row items-center justify-center gap-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {/* Primary CTA */}
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
              <Rocket size={20} />
              Explore Courses
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/mock-tests/#free-mock-tests"
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
              <ClipboardList size={20} />
              Give a Free Test
            </Link>
          </div>

          {/* YouTube video */}
          <div className="w-full mt-16" data-aos="fade-up" data-aos-delay="600">
            <YoutubeVideo videoId="vr8fpH3Z98Q" />
          </div>
        </div>
      </section>
  );
};

export default Hero;
