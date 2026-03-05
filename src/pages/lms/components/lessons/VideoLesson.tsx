import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface VideoLessonProps {
  url: string;
  poster?: string;
  onProgress: (percent: number) => void;
  onEnded: () => void;
}

export const VideoLesson: React.FC<VideoLessonProps> = ({ url, poster, onProgress, onEnded }) => {
  const isYoutube = url.includes('youtube') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fallback for iframe videos since we can't easily track progress without postMessage API
  // We'll simulate progress based on a generic time if it's an iframe
  useEffect(() => {
    if (isYoutube || isVimeo) {
      let time = 0;
      const interval = setInterval(() => {
        time += 1;
        // Simulate a 10 minute video for progress if it's an iframe
        const simPercent = Math.min((time / 600) * 100, 100);
        onProgress(simPercent / 100);
        if (simPercent >= 90) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isYoutube, isVimeo, onProgress]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
      onProgress(p / 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (isYoutube) {
    const embedUrl = url.replace('watch?v=', 'embed/').split('&')[0] + '?rel=0&modestbranding=1';
    return (
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
        <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen frameBorder="0" title="Video Lesson" />
      </div>
    );
  }

  if (isVimeo) {
    const embedUrl = url.replace('vimeo.com/', 'player.vimeo.com/video/');
    return (
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
        <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen frameBorder="0" title="Video Lesson" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group flex flex-col">
      <video 
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          onEnded();
        }}
      />

      {/* Custom Controls Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 transition-opacity duration-300",
        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}>
        
        {/* Big Play Button Center */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-primary-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
              <Play className="w-8 h-8 text-white ml-1 fill-white" />
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/30 rounded-full mb-6 overflow-hidden cursor-pointer group/progress">
          <motion.div 
            className="h-full bg-primary-500 rounded-full group-hover/progress:bg-primary-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-primary-400 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <button onClick={toggleMute} className="hover:text-primary-400 transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium font-mono">
              {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'} / {videoRef.current ? formatTime(videoRef.current.duration) : '0:00'}
            </span>
            <button onClick={toggleFullscreen} className="hover:text-primary-400 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for video time formatting
function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
