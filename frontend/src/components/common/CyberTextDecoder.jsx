import React, { useState, useEffect, useRef } from 'react';

export const CyberTextDecoder = ({ 
  text, 
  duration = 1200, 
  triggerOnHover = true, 
  className = '', 
  style = {},
  prefix = '' 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const glyphs = '01#%&*$/\\[]{}><@!?+=~^ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const animatingRef = useRef(false);

  const startScramble = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const length = text.length;
    let iteration = 0;
    const totalSteps = 24;
    const intervalTime = duration / totalSteps;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < (iteration / totalSteps) * length) {
              return text[index];
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');
      });

      iteration++;

      if (iteration > totalSteps) {
        clearInterval(interval);
        setDisplayText(text);
        animatingRef.current = false;
      }
    }, intervalTime);
  };

  useEffect(() => {
    startScramble();
  }, [text]);

  return (
    <span
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        cursor: triggerOnHover ? 'crosshair' : 'inherit',
      }}
      onMouseEnter={() => {
        if (triggerOnHover) startScramble();
      }}
      title={triggerOnHover ? "Hover to re-decrypt" : undefined}
    >
      {prefix}
      {displayText}
    </span>
  );
};
