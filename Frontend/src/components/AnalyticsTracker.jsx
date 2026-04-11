import { useLocation } from "react-router";
import { useEffect } from "react";
import { trackPageView } from "../analytics.js";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default AnalyticsTracker;