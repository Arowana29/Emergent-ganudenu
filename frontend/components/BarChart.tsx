import React from 'react';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';

interface BarData {
  label: string;
  income: number;
  expenses: number;
}

interface BarChartProps {
  data: BarData[];
  width: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, width }) => {
  const chartH = 110;
  const padding = 20;
  const availW = width - padding * 2;
  const groupW = availW / (data.length || 1);
  const barW = Math.min(groupW * 0.3, 14);
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expenses]), 1);

  return (
    <Svg width={width} height={chartH + 30}>
      {data.map((d, i) => {
        const x = padding + i * groupW + groupW * 0.15;
        const incH = Math.max((d.income / maxVal) * chartH, d.income > 0 ? 3 : 0);
        const expH = Math.max((d.expenses / maxVal) * chartH, d.expenses > 0 ? 3 : 0);
        const cx = x + barW + 1.5;

        return (
          <G key={i}>
            <Rect x={x} y={chartH - incH} width={barW} height={incH} fill="#10B981" rx={3} />
            <Rect x={x + barW + 3} y={chartH - expH} width={barW} height={expH} fill="#7C3AED" rx={3} />
            <SvgText x={cx} y={chartH + 18} textAnchor="middle" fontSize={9} fill="#9CA3AF">
              {d.label}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

export default BarChart;
