import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/base.css";

const YoutubeVideo = ({ videoId }) => {
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="w-full flex justify-center">
      <div className="relative group w-full max-w-4xl">
        {/* Glow background */}
        <div
          className="
          pointer-events-none
          absolute -inset-2
          rounded-2xl
          bg-gradient-to-r from-highlighted/30 via-cyan-400/20 to-highlighted/30
          opacity-0 blur-xl
          transition duration-500
          group-hover:opacity-100
          "
        />

        {/* Player wrapper */}
        <div
          className="
          relative
          transition-all duration-300 ease-out
          group-hover:-translate-y-1
          group-hover:scale-[1.01]
          "
        >
          <MediaPlayer
            src={`youtube/${videoId}?playsinline=1`}
            title="Complete Roadmap After B.Sc & B.Tech In BioTech"
            aspectRatio="16/9"
            playsInline
            className="
              media-player w-full cursor-pointer rounded-xl overflow-hidden
              transition-all duration-300

              shadow-lg shadow-black/10
              group-hover:shadow-xl group-hover:shadow-black/20

              dark:shadow-black/40 dark:group-hover:shadow-black/60

              [--video-border:1px_solid_rgba(0,0,0,0.02)]
              dark:[--video-border:1px_solid_rgba(255,255,255,0.15)]

              [--video-border-radius:16px]

              [--video-controls-transition:80ms]
              [--video-scrim-transition:80ms]
            "
          >
            <MediaProvider>
              <Poster
                src={thumbnail}
                className="vds-poster absolute inset-0 w-full h-full object-cover"
              />
            </MediaProvider>

            <DefaultVideoLayout
              icons={defaultLayoutIcons}
              className="
  [&_.vds-time-slider]:opacity-0
  group-hover:[&_.vds-time-slider]:opacity-100
  [&_.vds-time-slider]:transition-opacity
  [&_.vds-time-slider]:duration-150
  "
            />
          </MediaPlayer>
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideo;
