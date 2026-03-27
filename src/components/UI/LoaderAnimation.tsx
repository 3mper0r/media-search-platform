'use client'
import { useEffect, useState } from "react";
import clsx from 'clsx'
export default function LoaderAnimation() {

  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // start fade

      setTimeout(() => {
        setIsVisible(false); // remove from DOM
      }, 600); // match CSS transition
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;
  
  return (
    <div
      className={clsx(
        "loading",
        fadeOut && "loading-fade-out"
      )}
    >
      <div className="loading-text">
        {"IMAGO".split("").map((letter, index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}