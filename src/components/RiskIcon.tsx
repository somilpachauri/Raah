import React from 'react';
import Svg, { Circle, Polygon, Rect, Path } from 'react-native-svg';
import { risk, nightRisk, type Level } from '../design/tokens';

interface RiskIconProps {
  level: Level;
  size?: number;
  night?: boolean;
}

/**
 * Four custom SVG shapes for the four risk levels:
 * 0=circle, 1=triangle, 2=diamond, 3=octagon.
 *
 * Colour is never the only carrier of risk: shape + word always appear.
 */
export function RiskIcon({ level, size = 16, night: isNight = false }: RiskIconProps) {
  const fill = isNight ? nightRisk[level] : risk[level].fill;
  const halfSize = size / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {level === 0 && (
        <Circle cx={halfSize} cy={halfSize} r={halfSize * 0.85} fill={fill} />
      )}
      {level === 1 && (
        <Polygon
          points={`${halfSize},${size * 0.08} ${size * 0.92},${size * 0.88} ${size * 0.08},${size * 0.88}`}
          fill={fill}
        />
      )}
      {level === 2 && (
        <Polygon
          points={`${halfSize},${size * 0.05} ${size * 0.95},${halfSize} ${halfSize},${size * 0.95} ${size * 0.05},${halfSize}`}
          fill={fill}
        />
      )}
      {level === 3 && (() => {
        // Octagon: 8 vertices
        const inset = size * 0.29;
        const pts = [
          `${inset},0`,
          `${size - inset},0`,
          `${size},${inset}`,
          `${size},${size - inset}`,
          `${size - inset},${size}`,
          `${inset},${size}`,
          `0,${size - inset}`,
          `0,${inset}`,
        ].join(' ');
        return <Polygon points={pts} fill={fill} />;
      })()}
    </Svg>
  );
}
