import React, { memo } from 'react';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';

const StopLoadingIcon = memo((props: { className?: string }) => {
  const { className } = props;
  const [contextLocale] = useLocale('Sender', enUS.Sender);
  return (
    <svg
      color="currentColor"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{contextLocale.stopLoading}</title>
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
