import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import sayanImg from "../assets/sayanpic.png";
import rupayanImg from "../assets/Rupayanpic.png";
import subhadeepImg from "../assets/Subhadeep.png";
import akashImg from "../assets/Akashpic.jpg";
import krishnenduImg from "../assets/krishnendupic.jpg";
import saubhagyaImg from "../assets/Saubhagya_Ghosh.jpeg";
import Microdome from "../assets/microdome.jpg";

import { Helmet } from "react-helmet-async";

const faculties = [
  {
    id: 1,
    facultyName: "Sayan Ganguly",
    facultyTitle:
      "Founder | Molecular Biology, Cell Biology Educator",
    facultyImage: sayanImg,
    facultyDescription:
      "Sayan Ganguly is currently a Research Scholar at CSIR–IICB. He holds an M.Sc. degree in Virology from the ICMR–National Institute of Virology, Pune. He has qualified top national-level examinations including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.",
    experties: ["Molecular Biology", "Cell Biology", "Biophysics"],
  },
  {
    id: 2,
    facultyName: "Saubhagya Ghosh",
    facultyTitle:
      "Actogen Mentor | Recombinant DNA, Animal Biology",
    facultyImage: saubhagyaImg,
    facultyDescription:
      "Saubhagya is currently pursuing his PhD from IISER Pune. He completed his M.Sc. in Biology from IISER Thiruvananthapuram. He has qualified several competitive examinations, including GATE XL with AIR 29, DBT JRF, and IIT JAM with AIR 268.",
    experties: ["Biology", "Life Sciences", "Biotech"],
  },
  {
    id: 3,
    facultyName: "Subhadeep Podder",
    facultyTitle:
      "Actogen Mentor | Genetics, Evolution",
    facultyImage: subhadeepImg,
    facultyDescription:
      "Subhadeep holds an M.Sc. degree in Virology from ICMR–National Institute of Virology, Pune, and previously earned a B.Sc. (Hons.) degree in Microbiology from St. Xavier’s College, Kolkata. He is a recipient of the DST INSPIRE Scholarship, awarded for his academic excellence and research potential.",
    experties: ["Genetics", "Evolution", "Physiology"],
  },
  {
    id: 4,
    facultyName: "Akash Biswas",
    facultyTitle:
      "Semester Mentor | Biotechnology",
    facultyImage: akashImg,
    facultyDescription:
      "Akash is currently a Research Scholar at Gujarat Biotechnology University. He holds a B.Sc. (Hons.) degree in Microbiology from Kalyani Mahavidyalaya. He has qualified several national-level examinations, including TIFR, IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.",
    experties: ["Microbiology", "Industrial", "Agriculture"],
  },
  {
    id: 5,
    facultyName: "Rupayan Bhattacharjee",
    facultyTitle:
      "Actogen Mentor | Biochemistry, Plant Biology",
    facultyImage: rupayanImg,
    facultyDescription:
      "Rupayan Bhattacharjee is currently a Research Scholar at IIT Kharagpur. He holds an M.Sc. in Virology degree from ICMR–National Institute of Virology, Pune. He has qualified national-level examinations including CUET-PG, AIIMS, and SPPU OEE.",
    experties: ["Biochemistry", "Metabolism", "Plant"],
  },
];

const adjunctFaculties = [
  {
    id: 6,
    facultyName: "Krishnendu Das",
    facultyTitle: "Bioinformatics Educator",
    facultyImage: krishnenduImg,
    facultyDescription:
      "Krishnendu is currently a Research Scholar at ICMR–National Institute of Virology. He holds an M.Sc. degree in Virology from ICMR–NIV, Pune, and previously earned a B.Sc. (Hons.) degree in Microbiology from Ramakrishna Mission Vidyamandira, Belur. He has qualified several national-level examinations, including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.",
    experties: ["Bioinformatics"],
  },
];

const Faculties = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const Card = (faculty, index) => (
    <div
      key={faculty.id}
      data-aos="fade-up"
      data-aos-delay={index * 100}
      className="group bg-white dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800
      rounded-2xl px-4 py-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* IMAGE */}
      <div className="flex justify-center">
        <img
          src={faculty.facultyImage}
          alt={faculty.facultyName}
          className="w-24 h-24 rounded-full object-cover ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-highlighted"
        />
      </div>

      {/* CONTENT */}
      <div className="mt-4 text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {faculty.facultyName}
        </h3>

        <p className="text-xs text-highlighted font-medium">
          {faculty.facultyTitle}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {faculty.facultyDescription}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {faculty.experties.map((exp, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
            >
              {exp}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Faculties | Microdome Classes</title>
        <meta
          name="description"
          content="Meet expert faculties guiding students for IIT JAM, GATE, CUET PG."
        />
        <meta property="og:image" content={Microdome} />
      </Helmet>

      <section className="py-32 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Meet Our <span className="text-highlighted">Faculties</span>
            </h2>

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-base">
              Learn from mentors who cracked top exams and bring real experience.
            </p>
          </div>

          {/* MAIN FACULTY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculties.map((f, i) => Card(f, i))}
          </div>

          {/* ADJUNCT */}
          <div className="mt-20 pt-16 border-t border-gray-200 dark:border-zinc-800">

            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                Adjunct <span className="text-highlighted">Faculty</span>
              </h3>

              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Additional experts contributing to advanced learning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {adjunctFaculties.map((f, i) => Card(f, i))}
            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default Faculties;