import React, { memo } from 'react';

const StopLoadingIcon = memo((props: { className?: string }) => {
  const { className } = props;

  return (
    <svg
      color="currentColor"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <title>Stop Loading Icon</title>
      <rect fill="currentColor" height="250" rx="24" ry="24" width="250" x="375" y="375" />

      <circle
        cx="500"
        cy="500"
        fill="none"
        r="450"
        stroke="currentColor"
        strokeWidth="100"
        opacity="0.45"
      />

      <circle
        cx="500"
        cy="500"
        fill="none"
        r="450"
        stroke="currentColor"
        strokeWidth="100"
        strokeDasharray="600 9999999"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          from="0 500 500"
          repeatCount="indefinite"
          to="360 500 500"
          type="rotate"
        />
      </circle>
    </svg>
  );
});
export default StopLoadingIcon;
