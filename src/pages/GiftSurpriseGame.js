import React, { useState } from 'react';
import './GiftSurpriseGame.css';

// Local image paths assuming they're in public folder
const imageUrls = Array.from({ length: 24 }, (_, i) => `${process.env.PUBLIC_URL}/images/arki${i + 1}.jpg`);

export default function GiftSurpriseGame() {
  const [revealedImages, setRevealedImages] = useState([]);
  const [isBoxOpen, setIsBoxOpen] = useState(false);

  const handleBoxClick = () => {
    if (revealedImages.length >= 24) return;
    const remaining = imageUrls.filter((url) => !revealedImages.includes(url));
    const randomImg = remaining[Math.floor(Math.random() * remaining.length)];
    setRevealedImages([...revealedImages, randomImg]);
    setIsBoxOpen(true);

    setTimeout(() => {
      setIsBoxOpen(false);
    }, 1000);
  };

  return (
    <div className="gift-wrapper">
      <h1>🎁 Gift Box Surprise 🎁</h1>
      <p>{revealedImages.length < 24 ? "Click the box to reveal your surprise!" : "You’ve opened all 24 gifts!"}</p>

      <div className={`gift-box ${isBoxOpen ? 'open' : ''}`} onClick={handleBoxClick}>
        🎁
      </div>

      <div className="image-grid">
        {revealedImages.map((url, index) => (
          <img key={index} src={url} alt={`Surprise ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}
