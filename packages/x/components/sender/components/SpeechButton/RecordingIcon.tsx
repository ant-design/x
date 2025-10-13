import React from 'react';
import { useLocale } from '../../../locale';
import enUS from '../../../locale/en_US';
export interface RecordingIconProps {
  className?: string;
}

const SIZE = 1000;
const COUNT = 4;
const RECT_WIDTH = 140;
const RECT_RADIUS = RECT_WIDTH / 2;
const RECT_HEIGHT_MIN = 250;
const RECT_HEIGHT_MAX = 500;
const DURATION = 0.8;

export default function RecordingIcon({ className }: RecordingIconProps) {
  const [contextLocale] = useLocale('Sender', enUS.Sender);
  return (
    <svg
      color="currentColor"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{contextLocale.speechRecording}</title>

      {Array.from({ length: COUNT }).map((_, index) => {
        const dest = (SIZE - RECT_WIDTH * COUNT) / (COUNT - 1);
        const x = index * (dest + RECT_WIDTH);
        const yMin = SIZE / 2 - RECT_HEIGHT_MIN / 2;
        const yMax = SIZE / 2 - RECT_HEIGHT_MAX / 2;

        return (
          <rect
            fill="currentColor"
            rx={RECT_RADIUS}
            ry={RECT_RADIUS}
            height={RECT_HEIGHT_MIN}
            width={RECT_WIDTH}
            x={x}
            y={yMin}
            key={index}
          >
            <animate
              attributeName="height"
              values={`${RECT_HEIGHT_MIN}; ${RECT_HEIGHT_MAX}; ${RECT_HEIGHT_MIN}`}
              keyTimes="0; 0.5; 1"
              dur={`${DURATION}s`}
              begin={`${(DURATION / COUNT) * index}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${yMin}; ${yMax}; ${yMin}`}
              keyTimes="0; 0.5; 1"
              dur={`${DURATION}s`}
              begin={`${(DURATION / COUNT) * index}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
    </svg>
  );
}
