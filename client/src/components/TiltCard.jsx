import React, { useRef, useState } from "react";

const TiltCard = ({ children, className = "", maxTilt = 12, glare = true }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform:
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.4s ease-out",
  });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.18,
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform:
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out",
    });
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative overflow-hidden transform-style-3d ${className}`}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 245, 255, ${glarePos.opacity}), transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard;
