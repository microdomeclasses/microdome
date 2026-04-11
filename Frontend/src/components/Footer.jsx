import { Link } from "react-router";
import {
  RiFacebookCircleFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiYoutubeFill,
} from "@remixicon/react";

import {
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Code,
  Code2,
  MapPin
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="w-full text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-16 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500"></div>
        {/* Top Grid */}
        <div className="w-full flex flex-col md:flex-row gap-16">
          <div className="md:pl-4">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-16" />
            </Link>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-sm">
              Preparing students for biotechnology entrance exams with expert
              mentors and structured courses.
            </p>

            <div className="flex gap-4 mt-5 text-gray-600 dark:text-gray-300">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/profile.php?id=100014111567971&ref=ig_profile_ac"
                className="hover:text-blue-500 transition transform hover:scale-110"
              >
                <RiFacebookCircleFill size={22} />
              </a>

              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/say_an_02"
                className="hover:text-pink-500 transition transform hover:scale-110"
              >
                <RiInstagramFill size={22} />
              </a>

              <a
                target="_blank"
                rel="noreferrer"
                href="https://linkedin.com/in/sayan-ganguly-5883831bb"
                className="hover:text-blue-500 transition transform hover:scale-110"
              >
                <RiLinkedinBoxFill size={22} />
              </a>

              <a
                target="_blank"
                rel="noreferrer"
                href="https://youtube.com/@microdomeclasses"
                className="hover:text-red-500 transition transform hover:scale-110"
              >
                <RiYoutubeFill size={22} />
              </a>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row md:justify-between gap-8">
            {/* Company */}
            {/* <div className="md:px-8">
              <h3 className="text-base font-semibold mb-4">Company</h3>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link
                    to="/about-us"
                    className="hover:text-highlighted transition"
                  >
                    About Us
                  </Link>
                </li>
                <li className="hover:text-highlighted transition cursor-pointer">
                  Support
                </li>
                <li className="hover:text-highlighted transition cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-highlighted transition cursor-pointer">
                  Terms & Conditions
                </li>
                <li className="hover:text-highlighted transition cursor-pointer">
                  Pricing & Refund
                </li>
              </ul>
            </div> */}

            {/*Contact*/}

            <div className="md:px-8 ">
              <h3 className="text-base font-semibold mb-4">Contact</h3>

              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {/* LOCATION */}
                 <li className="flex items-center gap-2 hover:text-highlighted transition">
                  <MapPin className="w-4 h-4" />
                    Serampore, Kolkata – 712203
                </li>

                {/* EMAIL */}
                <li className="flex items-center gap-2 hover:text-highlighted transition">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@microdomeclasses.in">
                    info@microdomeclasses.in
                  </a>
                </li>

                {/* PHONE */}
                <li className="flex items-center gap-2 hover:text-highlighted transition">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+918478805171">+91 84788 05171</a>
                </li>

                {/* CONTACT PAGE */}
                <li className="flex items-center gap-2 hover:text-highlighted transition">
                  <MessageCircle className="w-4 h-4" />
                  <Link to="/#contact">Contact Form</Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="md:px-8">
              <h3 className="text-base font-semibold mb-4">Quick Links</h3>

              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <Link
                    to="/courses"
                    className="hover:text-highlighted transition"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mock-tests"
                    className="hover:text-highlighted transition"
                  >
                    Mock Tests
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/#testimonials"
                    className="hover:text-highlighted transition"
                  >
                    Testimonials
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/faculties"
                    className="hover:text-highlighted transition"
                  >
                    Our Faculties
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-highlighted transition"
                  >
                    Resources
                  </Link>
                </li>
                {/* <li className="hover:text-highlighted transition cursor-pointer">
                  FAQs
                </li> */}
              </ul>
            </div>

            {/* Community */}
            <div className="md:px-8">
              <h3 className="text-base font-semibold mb-4">Community</h3>

              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="hover:text-highlighted transition cursor-pointer">
                  Telegram
                </li>

                <li>
                  <Link
                    to="https://chat.whatsapp.com/LepMbONA6YlF95IGOITe8h?mode=ac_t"
                    target="_blank"
                    className="hover:text-highlighted transition"
                  >
                    WhatsApp
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Developers Button */}
        <div className="flex justify-center mt-2">
          <Link to="/developers">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-highlighted text-sm font-medium transition cursor-pointer">
              <Code2 className="w-4 h-4" />
              Meet Our Developers
            </button>
          </Link>
        </div>

        {/* <div className="mt-8 w-full flex items-center justify-end">
          <Link
            className="md:pr-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-highlighted"
            to="/developers"
          >
            <Code2 className="w-4 h-4" />
            Our Developers
          </Link>
        </div> */}

        {/* Bottom */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Microdome Classes. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
