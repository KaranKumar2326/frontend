import React, { useState, useEffect, useRef } from 'react';
import './ImageSlider.css';

export default function ImageSlider({ media, images }) {
  // Accepts either media (array of {type, src}) or images (array of URLs)
  const mediaItems = Array.isArray(media) && media.length > 0
    ? media
    : (Array.isArray(images) ? images.map(src => ({ type: 'image', src })) : []);
  const [current, setCurrent] = useState(0);
  const length = mediaItems.length;
  const [isSliding, setIsSliding] = useState(false);
  const [next, setNext] = useState(0);
  const timeoutRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-scroll every 6 seconds, but pause if a video is playing
  useEffect(() => {
    if (length === 0 || isVideoPlaying) return;
    const interval = setInterval(() => {
      setNext((current + 2) % length);
      setIsSliding(true);
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 2) % length);
        setIsSliding(false);
      }, 1000); // match the transition duration
    }, 6000); // Increased from 3000ms to 6000ms
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, [length, current, isVideoPlaying]);

  // Calculate which media to show
  const getVisibleMedia = () => {
    if (length <= 2) return mediaItems.map((item, i) => ({ ...item, key: `media-${i}`, type2: 'single' }));
    if (!isSliding) {
      // Show two current media
      if (current === length - 1) {
        return [
          { ...mediaItems[current], key: 'cur-1', type2: 'current' },
          { ...mediaItems[0], key: 'cur-2', type2: 'current' },
        ];
      }
      return [
        { ...mediaItems[current], key: 'cur-1', type2: 'current' },
        { ...mediaItems[(current + 1) % length], key: 'cur-2', type2: 'current' },
      ];
    } else {
      // During sliding, show both old and new media for cross-fade (2 old, 2 new)
      const oldIdx1 = current;
      const oldIdx2 = (current + 1) % length;
      const newIdx1 = next;
      const newIdx2 = (next + 1) % length;
      return [
        { ...mediaItems[oldIdx1], key: 'old-1', type2: 'old' },
        { ...mediaItems[oldIdx2], key: 'old-2', type2: 'old' },
        { ...mediaItems[newIdx1], key: 'new-1', type2: 'new' },
        { ...mediaItems[newIdx2], key: 'new-2', type2: 'new' },
      ];
    }
  };

  if (!Array.isArray(mediaItems) || mediaItems.length === 0) return null;

  // Helper to render image or video
  const renderMedia = (item, idx, arr, className) => {
    if (item.type === 'video') {
      return (
        <video
          src={item.src}
          controls
          className={className}
          key={item.key}
          style={{ width: '44vw', maxWidth: '420px', margin: '0', position: 'absolute', left: `calc(50vw - 23vw + ${idx * 23}vw - ${idx === 0 ? 30 : 0}px)` }}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          onEnded={() => setIsVideoPlaying(false)}
        />
      );
    }
    // Default to image
    return (
      <img
        src={item.src}
        crossOrigin="anonymous"
        alt={`slide-${current + idx}`}
        className={className}
        key={item.key}
        style={{ width: '44vw', maxWidth: '420px', margin: '0', position: 'absolute', left: `calc(50vw - 23vw + ${idx * 23}vw - ${idx === 0 ? 30 : 0}px)` }}
      />
    );
  };

  return(
    <div className="image-slider">
      <div className="slider-image-wrapper fade-horizontal" style={{ position: 'relative', width: '100vw', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isSliding && getVisibleMedia().map((item, idx, arr) =>
          renderMedia(item, idx, arr, 'slider-image fade-in')
        )}
        {isSliding && (
          <>
            {/* Old media fade out */}
            {getVisibleMedia().filter(i => i.type2 === 'old').map((item, idx) =>
              renderMedia(item, idx, null, 'slider-image fade-out-left')
            )}
            {/* New media fade in */}
            {getVisibleMedia().filter(i => i.type2 === 'new').map((item, idx) =>
              renderMedia(item, idx, null, 'slider-image fade-in-right')
            )}
          </>
        )}
      </div>
      <div className="slider-dots">
        {mediaItems.map((_, idx) => (
          <span
            key={idx}
            className={`slider-dot${idx === current ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}
