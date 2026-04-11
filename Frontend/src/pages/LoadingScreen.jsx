import { Logo } from "../components";

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">

      <div className="flex flex-col items-center gap-8">

        {/* Logo */}
        <Logo className="w-44 md:w-52 lg:w-60 animate-pulse" />

        {/* Progress bar */}
        <div className="w-40 h-[2px] bg-white/10 rounded overflow-hidden">
          <div className="h-full bg-highlighted animate-loading-bar"></div>
        </div>

      </div>

    </div>
  );
};

export default LoadingScreen;