import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from './ThemedText';
import { RiskBadge } from './RiskBadge';
import { Button } from './Button';
import { colors, spacing } from '../design/tokens';
import type { Segment } from '../api/types';

interface SegmentDetailProps {
  segment: Segment;
  updatedAt?: Date | string | number | null;
  onAlertMe?: () => void;
  onReport?: () => void;
}

export function SegmentDetail({ segment, updatedAt, onAlertMe, onReport }: SegmentDetailProps) {
  const { t } = useTranslation();
  
  const factors = segment.factors.slice(0, 3);
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText variant="h2" color={colors.ink}>
          {segment.name}
        </ThemedText>
        <ThemedText variant="small" color={colors.granite}>
          NH-7, km {segment.km_start} to {segment.km_end}
        </ThemedText>
        
        <View style={styles.verdictRow}>
          <RiskBadge level={segment.level} size={20} />
        </View>
        
        <ThemedText variant="verdict" color={colors.ink} style={styles.verdictText}>
          {t(`verdict.${segment.level}`)}
        </ThemedText>
        
        <ThemedText variant="small" color={colors.granite} style={styles.scoreText}>
          Score {segment.score} of 100
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText variant="h3" color={colors.ink} style={styles.sectionTitle}>
          {t('why.title', 'Why this stretch is risky')}
        </ThemedText>
        
        {factors.map(factor => (
          <View key={factor.code} style={styles.factorRow}>
            <ThemedText variant="body" color={colors.ink} style={styles.factorText}>
              {t(`factor.${factor.code}`, factor.code)}
            </ThemedText>
            {/* Simple bar representation of weight */}
            <View style={styles.factorBarBg}>
              <View style={[styles.factorBarFill, { width: `${factor.weight}%` }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText variant="h3" color={colors.ink} style={styles.sectionTitle}>
          Rain
        </ThemedText>
        
        <View style={styles.rainChart}>
          <ThemedText variant="body" color={colors.river}>
            ▁▂▃▅▇█▆▃│▂▁
          </ThemedText>
        </View>
        
        <ThemedText variant="body" color={colors.ink}>
          {segment.rain.last_24h_mm} mm in 24 h, {segment.rain.next_24h_mm} mm expected
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Button 
          label={t('alerts.subscribe', 'Alert me about this stretch')} 
          variant="primary" 
          onPress={onAlertMe || (() => {})}
        />
        <Button 
          label="Report a problem here" 
          variant="secondary" 
          onPress={onReport || (() => {})}
        />
      </View>

      <View style={styles.footer}>
        <ThemedText variant="caption" color={colors.granite}>
          {updatedAt ? t('status.fresh', { n: Math.floor((Date.now() - new Date(updatedAt).getTime()) / 60000) }) : ''}
        </ThemedText>
        <ThemedText variant="caption" color={colors.granite}>
          {t('disclaimer', 'This is an estimate...')}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  verdictRow: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  verdictText: {
    marginTop: spacing.xs,
  },
  scoreText: {
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  factorText: {
    flex: 1,
    marginRight: spacing.md,
  },
  factorBarBg: {
    width: 100,
    height: 6,
    backgroundColor: colors.glacier,
    borderRadius: 3,
    overflow: 'hidden',
  },
  factorBarFill: {
    height: '100%',
    backgroundColor: colors.granite,
  },
  rainChart: {
    marginBottom: spacing.sm,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  footer: {
    gap: spacing.xs,
  },
});
