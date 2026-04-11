import {
  Hero,
  About,
  WhyMicrodome,
  FeaturedCourses,
  Instructors,
  Testimonial,
  Contact,
} from "../components/Home";

import { useEffect, useState } from "react";
import axios from "axios";

import { Helmet } from "react-helmet-async";
const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/courses/get-all-courses?featured=true`);
        setCourses(res.data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  return (
    <>
      <Helmet>
        <title>Home | Microdome Classes</title>
        <meta
          name="description"
          content="Unlock your potential with Microdome Classes, specializing in online coaching for M.Sc and M.Tech entrance exams like IIT JAM, GATE, and CUET PG."
        />
        <meta
          name="keywords"
          content="Microdome, Online Coaching, M.Sc Entrance Exams, M.Tech Entrance Exams, IIT JAM, GATE, CUET PG"
        />
        <meta name="author" content="Microdome" />
        <meta property="og:title" content="Landing | Microdome Classes" />
        <meta
          property="og:description"
          content="At Microdome Classes, we specialize in online coaching for M.Sc and M.Tech entrance exams, including IIT JAM, GATE, and CUET PG. Our comprehensive courses provide students with the tools they need to excel in their biology studies and achieve their academic goals."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://microdomeclasses.in/" />
        <meta property="og:image" content="/microdomeLogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Landing | Microdome Classes" />
        <meta
          name="twitter:description"
          content="Unlock your potential with Microdome Classes, specializing in online coaching for M.Sc and M.Tech entrance exams like IIT JAM, GATE, and CUET PG."
        />
        <meta name="twitter:image" content="/microdomeLogo.png" />
        <link rel="canonical" href="https://microdomeclasses.in/" />
        <link rel="icon" href="/microdomeLogo.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Helmet>
      <Hero />
      <About />
      <WhyMicrodome />
      <FeaturedCourses courses={courses} loading={loading} />
      <Instructors />
      <Testimonial />
      <Contact />
    </>
  );
};

export default Home;
