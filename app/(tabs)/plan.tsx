import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppHeader, ThemedText } from '../../src/components';
import { colors, spacing } from '../../src/design/tokens';

export default function PlanScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title={t('nav.plan')} />
      <View style={styles.placeholder}>
        <ThemedText variant="h2" color={colors.granite}>
          {t('plan.title')}
        </ThemedText>
        <ThemedText variant="body" color={colors.granite}>
          Plan trip screen – coming next
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.snow,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
