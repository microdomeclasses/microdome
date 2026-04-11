import ReactGA from "react-ga4";

export const initAnalytics = () => {
  ReactGA.initialize("G-8XDC65WS8V");
};

export const trackPageView = (path) => {
  ReactGA.send({
    hitType: "pageview",
    page: path
  });
};