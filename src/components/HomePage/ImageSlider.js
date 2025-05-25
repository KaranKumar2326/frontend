import React, { useState, useEffect, useRef } from 'react';
import './ImageSlider.css';

export default function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const length = images.length;
  const [isSliding, setIsSliding] = useState(false);
  const [next, setNext] = useState(0);
  const timeoutRef = useRef(null);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNext((current + 2) % length);
      setIsSliding(true);
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 2) % length);
        setIsSliding(false);
      }, 1000); // match the transition duration
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, [length, current]);

  // Calculate which images to show
  const getVisibleImages = () => {
    if (length <= 2) return images.map((img, i) => ({ img, key: `img-${i}`, type: 'single' }));
    if (!isSliding) {
      // Show two current images
      if (current === length - 1) {
        return [
          { img: images[current], key: 'cur-1', type: 'current' },
          { img: images[0], key: 'cur-2', type: 'current' },
        ];
      }
      return [
        { img: images[current], key: 'cur-1', type: 'current' },
        { img: images[(current + 1) % length], key: 'cur-2', type: 'current' },
      ];
    } else {
      // During sliding, show both old and new images for cross-fade (2 old, 2 new)
      const oldIdx1 = current;
      const oldIdx2 = (current + 1) % length;
      const newIdx1 = next;
      const newIdx2 = (next + 1) % length;
      return [
        { img: images[oldIdx1], key: 'old-1', type: 'old' },
        { img: images[oldIdx2], key: 'old-2', type: 'old' },
        { img: images[newIdx1], key: 'new-1', type: 'new' },
        { img: images[newIdx2], key: 'new-2', type: 'new' },
      ];
    }
  };

  if (!Array.isArray(images) || images.length === 0) return null;

  return(
    <div className="image-slider">
      <div className="slider-image-wrapper fade-horizontal" style={{ position: 'relative', width: '100vw', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isSliding && getVisibleImages().map((item, idx, arr) => (
          <img
            src={item.img}
            alt={`slide-${current + idx}`}
            className="slider-image fade-in"
            key={item.key}
            style={{ width: '44vw', maxWidth: '420px', margin: '0', position: 'absolute', left: `calc(50vw - 23vw + ${idx * 23}vw - ${idx === 0 ? 30 : 0}px)` }}
          />
        ))}
        {isSliding && (
          <>
            {/* Old images fade out, positioned side by side and centered as a pair */}
            {getVisibleImages().filter(i => i.type === 'old').map((item, idx) => (
              <img
                src={item.img}
                alt={item.key}
                className="slider-image fade-out-left"
                key={item.key}
                style={{ width: '44vw', maxWidth: '420px', margin: '0', zIndex: 1, position: 'absolute', left: `calc(50vw - 23vw + ${idx * 23}vw - ${idx === 0 ? 30 : 0}px)` }}
              />
            ))}
            {/* New images fade in, positioned side by side and centered as a pair */}
            {getVisibleImages().filter(i => i.type === 'new').map((item, idx) => (
              <img
                src={item.img}
                alt={item.key}
                className="slider-image fade-in-right"
                key={item.key}
                style={{ width: '44vw', maxWidth: '420px', margin: '0', zIndex: 2, position: 'absolute', left: `calc(50vw - 23vw + ${idx * 23}vw - ${idx === 0 ? 30 : 0}px)` }}
              />
            ))}
          </>
        )}
      </div>
      <div className="slider-dots">
        {images.map((_, idx) => (
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
