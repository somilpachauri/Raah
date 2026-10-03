import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import { ThemedText } from './ThemedText';
import { risk, colors, type Level } from '../design/tokens';

interface StatusLineProps {
  /** When the data was last updated (Date or ISO string) */
  dataUpdatedAt?: Date | string | number | null;
  /** Force offline state for demo / testing */
  forceOffline?: boolean;
}

type StatusState = 'fresh' | 'stale' | 'old' | 'offline' | 'loading';

function getMinutesAgo(updatedAt: Date): number {
  return Math.floor((Date.now() - updatedAt.getTime()) / 60000);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * StatusLine: shows how fresh the data is.
 * - Fresh: green tint, "Updated X min ago"
 * - Stale (>30 min): moderate tint, "Data is X min old"
 * - Old (>3h) or offline: high tint, "Showing old data from HH:MM"
 */
export function StatusLine({ dataUpdatedAt, forceOffline = false }: StatusLineProps) {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  if (!dataUpdatedAt) {
    return (
      <View style={[styles.container, { backgroundColor: colors.glacier }]}>
        <ThemedText variant="small" color={colors.granite}>
          {t('status.loading')}
        </ThemedText>
      </View>
    );
  }

  const updatedDate = dataUpdatedAt instanceof Date
    ? dataUpdatedAt
    : new Date(dataUpdatedAt);
  const minutesAgo = getMinutesAgo(updatedDate);
  const timeStr = formatTime(updatedDate);

  let state: StatusState;
  if (forceOffline || !isConnected) {
    state = 'offline';
  } else if (minutesAgo > 180) {
    state = 'old';
  } else if (minutesAgo > 30) {
    state = 'stale';
  } else {
    state = 'fresh';
  }

  const bgColors: Record<StatusState, string> = {
    fresh: risk[0].tint,
    stale: risk[1].tint,
    old: risk[2].tint,
    offline: risk[2].tint,
    loading: colors.glacier,
  };

  const messages: Record<StatusState, string> = {
    fresh: t('status.fresh', { n: minutesAgo }),
    stale: t('status.stale', { n: minutesAgo }),
    old: t('status.old', { time: timeStr }),
    offline: t('status.offline', { time: timeStr }),
    loading: t('status.loading'),
  };

  return (
    <View
      style={[styles.container, { backgroundColor: bgColors[state] }]}
      accessibilityLabel={messages[state]}
      accessibilityRole="text"
    >
      <ThemedText variant="small" color={colors.ink}>
        {messages[state]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 0,
  },
});
