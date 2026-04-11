// CourseVideoPlayer.jsx

import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/base.css";

const CourseVideoPlayer = ({ videoId }) => {
  if (!videoId) {
    return (
      <div className="aspect-video flex items-center justify-center bg-black text-white rounded-lg">
        No video available
      </div>
    );
  }

  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <MediaPlayer
      src={`youtube/${videoId}`}
      aspectRatio="16/9"
      playsInline
      className="w-full bg-black rounded-lg overflow-hidden"
    >
      <MediaProvider>
        <Poster
          src={thumbnail}
          className="vds-poster absolute inset-0 w-full h-full object-cover"
        />
      </MediaProvider>

      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default CourseVideoPlayer;