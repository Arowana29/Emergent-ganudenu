import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface Segment {
  value: number;
  color: string;
}

interface DonutChartProps {
  data: Segment[];
  size?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, size = 180, strokeWidth = 34 }) => {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
      </Svg>
    );
  }

  let accum = 0;
  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={r} stroke="#F3F4F6" strokeWidth={strokeWidth} fill="none" />
      {data.map((seg, i) => {
        const arcLen = (seg.value / total) * circumference;
        const dashOffset = circumference - accum;
        accum += arcLen;
        return (
          <Circle
            key={i}
            cx={cx} cy={cy} r={r}
            stroke={seg.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
    </Svg>
  );
};

export default DonutChart;
