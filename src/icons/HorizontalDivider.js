import React, { useState, useEffect } from 'react';

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;


const HorizontalDivider = () => {
  let [lineWidth, setLineWidth] = useState(100);
  useEffect(() => {
    const resizeListener = () => {
      // change width from the state object
      const width = getWidth() < 640 ? 50 : 100;
      setLineWidth(width);
    };
    // set resize listener
    window.addEventListener('resize', resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener);
    }
  }, [])

  return (
    <svg height="30px" width={`${lineWidth}px`}>
      <circle cx="10" cy="14" r="4" stroke="#2d2d3e" strokeWidth="3" fill="#2d2d3e" />
      <g fill="none" stroke="#2d2d3e">
        <path strokeWidth="3" d={`M5 14 l${lineWidth - 10} 0`} />
      </g>
      <circle cx={lineWidth - 10} cy="14" r="4" stroke="#2d2d3e" strokeWidth="3" fill="#2d2d3e" />
    </svg>
  )
}

export default HorizontalDivider;