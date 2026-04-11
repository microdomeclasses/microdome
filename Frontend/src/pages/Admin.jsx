import { Link, NavLink, Outlet } from "react-router";
import {
  Home,
  Users,
  Star,
  Layers,
  Video,
  BookOpen,
  Plus,
  Tickets,
  FileQuestion,
  ClipboardList,
  Folder,
  User,
  ClipboardCheck,
  TicketPercent,
} from "lucide-react";

import { useSelector } from "react-redux";

import { Logo, UserIcon } from "../components";
import ThemeBtn from "../components/ThemeBtn";

const roleStyles = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  instructor:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const adminMenuItems = [
  { name: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
  { name: "Users", icon: <Users size={20} />, href: "/admin/users" },
  { name: "Courses", icon: <BookOpen size={20} />, href: "/admin/courses" },
  {
    name: "Quizzes",
    icon: <ClipboardCheck size={20} />,
    href: "/admin/quizzes",
  },
  {
    name: "Mock Tests",
    icon: <ClipboardList size={20} />,
    href: "/admin/mock-tests",
  },
  {
    name: "Mock Test Bundles",
    icon: <Folder size={20} />,
    href: "/admin/mock-test-bundles",
  },
  {
    name: "Bundle Enrollments",
    icon: <Users size={20} />,
    href: "/admin/bundles/enrollments",
  },
  {
    name: "Coupons",
    icon: <TicketPercent size={20} />,
    href: "/admin/coupons",
  },
];

const instructorMenuItems = [
  { name: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
  { name: "Users", icon: <Users size={20} />, href: "/admin/users" },
  { name: "Courses", icon: <BookOpen size={20} />, href: "/admin/courses" },
  {
    name: "Quizzes",
    icon: <ClipboardCheck size={20} />,
    href: "/admin/quizzes",
  },
  {
    name: "Mock Tests",
    icon: <ClipboardList size={20} />,
    href: "/admin/mock-tests",
  },
];

export default function Admin() {
  const user = useSelector((state) => state.auth?.userData);
  const theme = useSelector((state) => state.theme.theme);

  const menuItems =
    user?.role === "admin" ? adminMenuItems : instructorMenuItems;

  return (
    <div className={`flex h-screen ${theme}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-xl hidden md:flex flex-col">
        <Link
          to="/"
          className="px-6 py-5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800"
        >
          <Logo className={"w-7 md:w-9"} />
          <p className="text-lg font-bold gradiant-text">MicroDome</p>
        </Link>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition

                ${
                  isActive
                    ? "text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }

                hover:bg-blue-100 hover:text-blue-700
                dark:hover:bg-blue-900/30 dark:hover:text-blue-400
                `
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Navbar */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex justify-around py-3 shadow-md z-50">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `
              ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}

              flex flex-col items-center text-sm
              hover:text-blue-600 dark:hover:text-blue-400
              `
            }
          >
            {item.icon}

            <span className="text-xs mt-1">{item.name.split(" ")[0]}</span>
          </NavLink>
        ))}
      </div>

      {/* Main content */}

      <main className="flex-1 h-screen overflow-y-auto p-6 mb-24 md:mb-2 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 scrollbar-none">
        <div className="w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
