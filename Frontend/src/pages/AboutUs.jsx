import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

import Microdome from "../assets/microdome.jpg";
import { WhyMicrodome } from "../components/Home";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <>
      <Helmet>
        <title>
          About Microdome | Biology Coaching for IIT JAM, GAT-B & CUET-PG
        </title>

        <meta
          name="description"
          content="Microdome Classes provides expert mentorship and structured learning for IIT JAM, GAT-B and CUET-PG biology entrance exams."
        />

        <meta
          name="keywords"
          content="Microdome Classes, Biology Coaching, IIT JAM Biology, GAT-B preparation, CUET PG Biology coaching"
        />

        <meta property="og:title" content="About Microdome Classes" />
        <meta
          property="og:description"
          content="Learn about Microdome Classes and how we help students crack IIT JAM, GAT-B and CUET-PG."
        />
        <meta property="og:image" content={Microdome} />
      </Helmet>

      <section className="w-full py-16 md:py-20 flex justify-center">
        <div className="w-full max-w-6xl px-4 space-y-8 mt-16">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto" data-aos="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold">
              About <span className="text-highlighted">Microdome</span>
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              Microdome Classes is a modern biology coaching platform focused
              on helping students build strong concepts and succeed in
              competitive entrance examinations like IIT JAM, GAT-B and CUET-PG.
            </p>
          </div>

          {/* Who We Are */}
          <div
            className="mt-8 grid md:grid-cols-2 gap-8 items-center"
            data-aos="fade-up"
          >
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={Microdome}
                alt="Microdome Biology Coaching"
                className="
                w-64
                rounded-xl
                shadow-md
                border border-gray-200 dark:border-zinc-800
                transition hover:scale-[1.03]
                "
              />
            </div>

            {/* Text */}
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Our Mission
              </h2>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                At{" "}
                <span className="text-highlighted font-semibold">
                  Microdome
                </span>
                , we believe strong fundamentals are the key to success in the
                biological sciences. Our mission is to help students develop
                conceptual clarity and analytical thinking required for top
                entrance examinations.
              </p>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Through expert mentorship, structured classes and realistic
                exam practice, we prepare students for IIT JAM, GAT-B,
                CUET-PG and advanced studies in Life Sciences.
              </p>
            </div>
          </div>

          {/* Why Microdome */}
          <WhyMicrodome />

          {/* CTA */}
          <div className="text-center space-y-4" data-aos="fade-up">
            <h2 className="text-xl md:text-2xl font-semibold">
              Start Your Journey with Microdome
            </h2>

            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Join our courses and get guided preparation for IIT JAM,
              GAT-B and CUET-PG biology entrance exams.
            </p>

            <Link
              to="/courses"
              className="
              inline-flex items-center justify-center
              px-6 py-3
              text-base font-semibold
              rounded-lg
              bg-highlighted
              text-white
              shadow-md
              transition
              hover:bg-highlighted-hover
              hover:shadow-lg
              "
            >
              Explore Courses
            </Link>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutUs;