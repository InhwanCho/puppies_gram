import YouTube, { YouTubeProps } from "react-youtube";

interface VideoPlayerProps {
  videoId: string;
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const opts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 0,      
    }
  };
  return (
    <div className="youtubeContainer rounded-md">
      <YouTube
        videoId={videoId}
        opts={opts}        
        iframeClassName="youtubeContaineriframe"
        onEnd={(e) => {
          e.target.stopVideo(0);
        }}
      />
    </div>

  )
}
