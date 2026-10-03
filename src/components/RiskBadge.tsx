import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RiskIcon } from './RiskIcon';
import { ThemedText } from './ThemedText';
import { risk, night, colors, radii, type Level } from '../design/tokens';

interface RiskBadgeProps {
  level: Level;
  /** Replace the level word with the verdict text */
  showVerdict?: boolean;
  night?: boolean;
  size?: number;
}

/**
 * Risk shape + level word on the level's tint background.
 * Shape + word always appear together so colour is never the only carrier.
 */
export function RiskBadge({
  level,
  showVerdict = false,
  night: isNight = false,
  size = 16,
}: RiskBadgeProps) {
  const { t } = useTranslation();

  const tintBg = isNight ? 'rgba(255,255,255,0.08)' : risk[level].tint;
  const textColor = isNight ? night.text : colors.ink;

  const label = showVerdict
    ? t(`verdict.${level}`)
    : t(`risk_level.${level}`);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tintBg },
      ]}
      accessibilityLabel={`${t(`risk_level.${level}`)} risk`}
      accessibilityRole="text"
    >
      <RiskIcon level={level} size={size} night={isNight} />
      <ThemedText
        variant="small"
        color={textColor}
        style={styles.label}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.xs,
    gap: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'IBMPlexSansCondensed_600SemiBold',
    fontSize: 14,
  },
});
