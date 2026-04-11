import { Link } from "react-router";
import { useSelector } from 'react-redux';

const PageNotFound = () => {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div className={`${theme} bg-white dark:bg-gray-950 min-h-screen flex flex-col items-center justify-center text-center`}>
      <h1 className="text-7xl font-bold text-gray-800 dark:text-gray-100">404</h1>
      <h2 className="text-2xl mt-4 text-gray-700 dark:text-gray-200">Page Not Found</h2>
      <p className="text-gray-500 mt-2">
        The page you’re trying to access doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2 border rounded border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;
