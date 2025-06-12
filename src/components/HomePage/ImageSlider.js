import React, { useState, useEffect, useRef } from 'react';
import './ImageSlider.css';

export default function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const length = imageUrls.length;
  const [isSliding, setIsSliding] = useState(false);
  const [next, setNext] = useState(0);
  const timeoutRef = useRef(null);

  // Fetch image URLs from backend if images are IDs or objects
  useEffect(() => {
    async function fetchImages() {
      if (!Array.isArray(images) || images.length === 0) {
        setImageUrls([]);
        return;
      }
      // If already URLs, just use them
      if (typeof images[0] === 'string' && images[0].startsWith('http')) {
        setImageUrls(images);
        return;
      }
      // If images are objects with imageUrl or _id
      if (typeof images[0] === 'object') {
        // If they have imageUrl, use it
        if (images[0].imageUrl) {
          setImageUrls(images.map(img => img.imageUrl));
          return;
        }
        // If they have _id, fetch from backend
        if (images[0]._id) {
          try {
            const urls = await Promise.all(images.map(async (img) => {
              const res = await fetch(`http://localhost:3001/api/images/${img._id}`);
              if (res.ok) {
                const data = await res.json();
                return data.url;
              }
              return null;
            }));
            setImageUrls(urls.filter(Boolean));
            return;
          } catch (e) {
            setImageUrls([]);
            return;
          }
        }
      }
      // Fallback: treat as URLs
      setImageUrls(images);
    }
    fetchImages();
  }, [images]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (length === 0) return;
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
    if (length <= 2) return imageUrls.map((img, i) => ({ img, key: `img-${i}`, type: 'single' }));
    if (!isSliding) {
      // Show two current images
      if (current === length - 1) {
        return [
          { img: imageUrls[current], key: 'cur-1', type: 'current' },
          { img: imageUrls[0], key: 'cur-2', type: 'current' },
        ];
      }
      return [
        { img: imageUrls[current], key: 'cur-1', type: 'current' },
        { img: imageUrls[(current + 1) % length], key: 'cur-2', type: 'current' },
      ];
    } else {
      // During sliding, show both old and new images for cross-fade (2 old, 2 new)
      const oldIdx1 = current;
      const oldIdx2 = (current + 1) % length;
      const newIdx1 = next;
      const newIdx2 = (next + 1) % length;
      return [
        { img: imageUrls[oldIdx1], key: 'old-1', type: 'old' },
        { img: imageUrls[oldIdx2], key: 'old-2', type: 'old' },
        { img: imageUrls[newIdx1], key: 'new-1', type: 'new' },
        { img: imageUrls[newIdx2], key: 'new-2', type: 'new' },
      ];
    }
  };

  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return null;

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
        {imageUrls.map((_, idx) => (
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
